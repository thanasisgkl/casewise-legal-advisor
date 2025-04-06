import express, { Request, Response, NextFunction } from 'express';
import { analyzeCase } from './analyze-case';
import { analyzeDocument, askQuestion } from './services/ai.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import multer from 'multer';
import cors from 'cors';
import pdfParse from 'pdf-parse';
import { createWorker, PSM } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { fromPath } from 'pdf2pic';
import sharp from 'sharp';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(os.tmpdir(), 'casewise-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Μόνο PDF και εικόνες (JPEG/PNG) επιτρέπονται'));
    }
    cb(null, true);
  }
});

// Increase timeout to 2 minutes
app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes
  next();
});

// Enable CORS for development
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Initialize Google Cloud Vision client
const vision = new ImageAnnotatorClient({
  keyFilename: './mindguard-453821-1638ff49dd83.json'
});

// Function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(str1: string, str2: string): number {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (str1.charAt(i - 1) !== str2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[str2.length] = lastValue;
  }
  return costs[str2.length];
}

async function preprocessImage(inputPath: string): Promise<Buffer> {
  try {
    console.log('Starting image preprocessing...');
    const image = sharp(inputPath);
    
    // Get image metadata
    const metadata = await image.metadata();
    console.log('Image metadata:', metadata);
    
    // Calculate new dimensions for 300 DPI
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;
    const scale = 300 / (metadata.density || 72);
    console.log(`Resizing to ${Math.round(width * scale)}x${Math.round(height * scale)} at 300 DPI`);
    
    // Convert to PNG and apply preprocessing
    const processedImage = await image
      .toFormat('png')
      .grayscale()
      .resize(Math.round(width * scale), Math.round(height * scale), {
        kernel: sharp.kernel.lanczos3,
        fit: 'fill'
      })
      .normalize()
      .linear(1.1, -0.1) // Μικρότερη αντίθεση
      .gamma(1.1) // Ελαφρώς πιο σκούρο για καλύτερη αναγνώριση
      .median(1) // Ελαφρύ blur για μείωση θορύβου
      .sharpen({
        sigma: 0.8,
        m1: 0.5,
        m2: 0.2,
        x1: 2,
        y2: 10,
        y3: 10
      })
      .toBuffer();

    console.log('Image preprocessing completed successfully');
    return processedImage;
  } catch (error) {
    console.error('Error in preprocessImage:', error);
    throw error;
  }
}

async function performMultipleOCR(imageBuffer: Buffer): Promise<string> {
  try {
    // Δημιουργία προσωρινού αρχείου για το OCR
    const tempImagePath = path.join(os.tmpdir(), `temp-${Date.now()}.png`);
    await fs.promises.writeFile(tempImagePath, imageBuffer);

    console.log('Starting OCR process with preprocessed image...');

    // 1. Google Vision OCR με error handling
    let googleText = '';
    try {
      console.log('Starting Google Vision OCR...');
      const request = {
        image: {
          content: imageBuffer.toString('base64')
        },
        imageContext: {
          languageHints: ['el-t-i0-handwrit', 'el']
        }
      };
      
      console.log('Sending request to Google Vision API...');
      const [result] = await vision.documentTextDetection(request);
      googleText = result.fullTextAnnotation?.text || '';
      console.log('Google Vision OCR completed. Text length:', googleText.length);
      console.log('First 200 characters from Google Vision:', googleText.substring(0, 200));
    } catch (error) {
      console.error('Error in Google Vision OCR:', error);
    }

    // 2. Tesseract OCR με error handling
    let tesseractText = '';
    try {
      console.log('Starting Tesseract OCR...');
      const worker = await createWorker('ell+eng');
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_char_whitelist: 'αβγδεζηθικλμνξοπρστυφχψωςΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩάέήίόύώϊϋΐΰ.,()-0123456789 ',
        preserve_interword_spaces: '1'
      });
      const tesseractResult = await worker.recognize(tempImagePath);
      await worker.terminate();
      tesseractText = tesseractResult.data.text || '';
      console.log('Tesseract OCR completed. Text length:', tesseractText.length);
      console.log('First 200 characters from Tesseract:', tesseractText.substring(0, 200));
    } catch (error) {
      console.error('Error in Tesseract OCR:', error);
    }

    // Καθαρισμός προσωρινού αρχείου
    try {
      await fs.promises.unlink(tempImagePath);
      console.log('Temporary file deleted');
    } catch (error) {
      console.error('Error deleting temp file:', error);
    }

    // Καθαρισμός και φιλτράρισμα γραμμών με πιο αυστηρά κριτήρια
    console.log('Starting text processing...');
    
    const cleanLine = (line: string): string => {
      return line
        .trim()
        .replace(/[^\u0370-\u03FF\w\s.,()%-€₯$&@#*+=/\\'"°²³½¼¾×÷±<>{}[\]]/g, '') // Επιτρέπουμε ειδικά σύμβολα
        .replace(/\s+/g, ' ') // Κανονικοποίηση κενών
        .trim();
    };

    const isValidLine = (line: string): boolean => {
      if (line.length < 10) return false; // Ελάχιστο μήκος γραμμής
      const greekChars = (line.match(/[\u0370-\u03FF]/g) || []).length;
      return greekChars > line.length * 0.3; // Τουλάχιστον 30% ελληνικοί χαρακτήρες
    };

    // Επεξεργασία αποτελεσμάτων με προτεραιότητα στο Google Vision
    console.log('Processing Google Vision results...');
    const googleLines = googleText.split('\n')
      .map(cleanLine)
      .filter(isValidLine);
    console.log('Valid lines from Google Vision:', googleLines.length);

    // Αν το Google Vision έδωσε καλό αποτέλεσμα, το χρησιμοποιούμε μόνο αυτό
    if (googleLines.length > 0) {
      console.log('Using Google Vision results only');
      const result = googleLines.join('\n');
      console.log('Final text length:', result.length);
      console.log('First 200 characters of final result:', result.substring(0, 200));
      return result;
    }

    // Αν το Google Vision απέτυχε, χρησιμοποιούμε το Tesseract
    console.log('Google Vision failed, processing Tesseract results...');
    const tesseractLines = tesseractText.split('\n')
      .map(cleanLine)
      .filter(isValidLine);
    console.log('Valid lines from Tesseract:', tesseractLines.length);

    const result = tesseractLines.join('\n');
    console.log('Final text length:', result.length);
    console.log('First 200 characters of final result:', result.substring(0, 200));
    
    return result;
  } catch (error) {
    console.error('Error in OCR:', error);
    throw error;
  }
}

// Συνάρτηση για εξαγωγή κειμένου από PDF
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    // Δημιουργία προσωρινού φακέλου αν δεν υπάρχει
    const tempDir = path.join(os.tmpdir(), 'casewise-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const options = {
      density: 300,
      saveFilename: 'temp',
      savePath: tempDir,
      format: 'png',
      width: 2480,
      height: 3508
    };

    console.log('Converting PDF to images...');
    const storeAsImage = fromPath(pdfPath, options);
    const pages = await storeAsImage.bulk(-1);
    console.log(`Converted ${pages.length} pages to images`);

    let fullText = '';

    for (const page of pages) {
      const imagePath = path.join(options.savePath, `temp.${page.page}.${options.format}`);
      console.log(`Processing page ${page.page} from ${imagePath}`);
      
      try {
        const imageBuffer = await fs.promises.readFile(imagePath);
        const text = await performMultipleOCR(imageBuffer);
        fullText += text + '\n';
        
        // Διαγραφή του προσωρινού αρχείου εικόνας
        await fs.promises.unlink(imagePath);
        console.log(`Deleted temp image for page ${page.page}`);
      } catch (pageError) {
        console.error(`Error processing page ${page.page}:`, pageError);
        // Συνεχίζουμε με την επόμενη σελίδα
        continue;
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error in extractTextFromPDF:', error);
    throw error;
  }
}

// Endpoint for case analysis
app.post('/api/cases/analyze', async (req, res) => {
  try {
    console.log('Received request for case analysis');
    console.log('Request body:', req.body);
    
    const { text } = req.body;
    if (!text) {
      console.log('No text provided in request');
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Starting case analysis...');
    const analysis = await analyzeCase(text);
    console.log('Case analysis completed successfully');
    
    // Αποθήκευση της τελευταίας ανάλυσης σε global μεταβλητή
    // για εύκολη ανάκτηση αργότερα
    app.locals.latestAnalysis = {
      timestamp: new Date(),
      data: analysis,
      text: text
    };
    
    return res.json({ analysis });
  } catch (error) {
    console.error('Error in case analysis:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error analyzing case' });
  }
});

// Νέο endpoint για ανάκτηση της τελευταίας ανάλυσης
app.get('/api/cases/latest-analysis', (req, res) => {
  try {
    console.log('Request for latest analysis data');
    if (!app.locals.latestAnalysis) {
      return res.status(404).json({ 
        error: 'Δεν υπάρχει αποθηκευμένη ανάλυση. Παρακαλώ ανεβάστε ένα έγγραφο για ανάλυση.' 
      });
    }
    
    // Επιστροφή της τελευταίας ανάλυσης που έχει αποθηκευτεί
    const { data, timestamp } = app.locals.latestAnalysis;
    console.log('Returning latest analysis from', timestamp);
    
    // Έλεγχος για αποφυγή διπλών επιπέδων στην απάντηση
    let analysisData = data;
    
    // Αν η δομή είναι { analysis: { ... } }, επιστρέφουμε μόνο το περιεχόμενο
    if (data && data.analysis && typeof data.analysis === 'object') {
      console.log('Removing nested analysis object structure');
      analysisData = data.analysis;
    }
    
    return res.json({ 
      analysis: analysisData,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Error retrieving latest analysis:', error);
    return res.status(500).json({ 
      error: 'Σφάλμα κατά την ανάκτηση της τελευταίας ανάλυσης' 
    });
  }
});

// Ενημερώνω το endpoint για να χειρίζεται και PDF
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Δεν υπάρχει αρχείο' });
    }

    console.log('Processing file:', req.file.originalname);
    console.log('File size:', req.file.size);
    console.log('File mimetype:', req.file.mimetype);
    console.log('File path:', req.file.path);

    let extractedText = '';

    // Έλεγχος για PDF
    if (req.file.mimetype === 'application/pdf') {
      console.log('Processing PDF file...');
      try {
        extractedText = await extractTextFromPDF(req.file.path);
      } catch (pdfError) {
        console.error('Error processing PDF:', pdfError);
        return res.status(500).json({ error: 'Αποτυχία επεξεργασίας PDF' });
      }
    } 
    // Έλεγχος για εικόνες
    else if (req.file.mimetype.startsWith('image/')) {
      console.log('Preprocessing image...');
      try {
        const processedImage = await preprocessImage(req.file.path);
        console.log('Image preprocessing completed');
        extractedText = await performMultipleOCR(processedImage);
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        return res.status(500).json({ error: 'Αποτυχία επεξεργασίας εικόνας' });
      }
    } 
    // Έλεγχος για μη υποστηριζόμενα αρχεία
    else {
      return res.status(400).json({ error: 'Μη υποστηριζόμενος τύπος αρχείου' });
    }

    console.log('OCR completed');
    await fs.promises.unlink(req.file.path);
    console.log('Deleted temp file:', req.file.path);
    
    // Προσθήκη: Αυτόματη ανάλυση του κειμένου με το AI
    console.log('Starting automatic case analysis after OCR...');
    try {
      const analysis = await analyzeCase(extractedText);
      console.log('Case analysis completed successfully');
      
      // Αποθήκευση της τελευταίας ανάλυσης
      app.locals.latestAnalysis = {
        timestamp: new Date(),
        data: analysis,
        text: extractedText
      };
      
      // Εξαγωγή του σωστού αντικειμένου ανάλυσης
      let analysisData = analysis;
      
      // Αν η ανάλυση έχει δομή { analysis: {...} }, χρησιμοποιούμε το εσωτερικό αντικείμενο
      if (analysis && analysis.analysis && typeof analysis.analysis === 'object') {
        console.log('Extracting nested analysis object for response');
        analysisData = analysis.analysis;
      }
      
      // Επιστροφή τόσο του κειμένου όσο και της ανάλυσης
      res.json({ 
        extractedText,
        text: extractedText, // Διατηρώ το παλιό πεδίο για συμβατότητα
        analysis: analysisData // Επιστρέφουμε το σωστό επίπεδο της ανάλυσης
      });
    } catch (analysisError) {
      console.error('Error in automatic analysis:', analysisError);
      // Επιστρέφουμε το κείμενο ακόμα και αν η ανάλυση αποτύχει
      res.json({ 
        extractedText,
        text: extractedText,
        error: 'Η αυτόματη ανάλυση απέτυχε, αλλά το κείμενο εξήχθη επιτυχώς.'
      });
    }
  } catch (error) {
    console.error('Error in file analysis:', error);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Αποτυχία ανάλυσης αρχείου' });
  }
});

// Νέο endpoint για το chatbot - απάντηση σε ερωτήσεις
app.post('/api/chat/ask', async (req, res) => {
  try {
    console.log('Received chat question request');
    
    const { question, context } = req.body;
    if (!question) {
      console.log('No question provided in request');
      return res.status(400).json({ error: 'Δεν δόθηκε ερώτηση' });
    }

    // Χρησιμοποιούμε το context αν παρέχεται, αλλιώς χρησιμοποιούμε τα τελευταία δεδομένα ανάλυσης
    let analysisContext = context || '';

    // Αν δεν έχει δοθεί context, χρησιμοποιούμε τα τελευταία δεδομένα ανάλυσης
    if (!analysisContext && app.locals.latestAnalysis) {
      console.log('Using latest analysis as context');
      const { text } = app.locals.latestAnalysis;
      if (text && text.length > 0) {
        analysisContext = text;
      }
    }

    // Αν και πάλι δεν έχουμε context, επιστρέφουμε σφάλμα
    if (!analysisContext) {
      return res.status(400).json({ 
        error: 'Δεν υπάρχει διαθέσιμο context για την ερώτηση. Παρακαλώ ανεβάστε πρώτα ένα έγγραφο για ανάλυση.'
      });
    }

    console.log('Starting AI question answering...');
    console.log('Context length:', analysisContext.length);
    console.log('Question:', question);
    
    const answer = await askQuestion(analysisContext, question);
    console.log('Question answered successfully');
    console.log('Answer length:', answer?.length || 0);
    
    return res.json({ answer });
  } catch (error) {
    console.error('Error in chat question processing:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Σφάλμα επεξεργασίας ερώτησης' });
  }
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Set server timeout to 2 minutes
server.timeout = 120000; // 2 minutes 