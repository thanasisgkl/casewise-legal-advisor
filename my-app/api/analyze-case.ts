import { analyzeDocument } from './services/ai.service';

// Ορισμός του interface LegalAnalysis
export interface LegalAnalysis {
  summary: string;
  details: string;
  recommendations: string[];
  references: {
    id: string;
    title: string;
    description: string;
  }[];
  outcomes: {
    id: string;
    scenario: string;
    probability: number;
    reasoning: string;
  }[];
}

// Λεξικό νομικών όρων
const legalTerms = {
  positive: [
    'αποδοχή', 'νίκη', 'αθώωση', 'αποζημίωση', 'ικανοποίηση', 'δικαίωση', 'επιτυχία',
    'σύσταση', 'νόμιμος', 'έγκυρος', 'συμφωνία', 'διακανονισμός', 'διευθέτηση',
    'εξόφληση', 'ρύθμιση', 'συμβιβασμός', 'καταβολή'
  ],
  negative: [
    'απόρριψη', 'καταδίκη', 'πρόστιμο', 'ποινή', 'κύρωση', 'παράβαση',
    'αμφισβήτηση', 'χρέος', 'οφειλή', 'υπερημερία', 'αθέτηση', 'παράλειψη',
    'καθυστέρηση', 'διαφορά', 'διένεξη', 'αντιδικία', 'διαμάχη'
  ],
  risk: [
    'κίνδυνος', 'απειλή', 'απώλεια', 'ζημία', 'αναστολή', 'προθεσμία', 'παραγραφή',
    'πτώχευση', 'αφερεγγυότητα', 'κατάσχεση', 'έκπτωση', 'ακύρωση', 'ανάκληση',
    'διάλυση', 'εκκαθάριση', 'αδυναμία'
  ],
  legal_entities: [
    'εταιρεία', 'κοινοπραξία', 'διαχειριστής', 'εταίρος', 'μέτοχος', 'διοίκηση',
    'διευθυντής', 'όργανο', 'επιχείρηση', 'νομικό πρόσωπο'
  ]
};

export interface CaseAnalysis {
  category: string;
  keywords: string[];
  summary: string;
  suggestions: string[];
}

// Ανάλυση κειμένου
export async function analyzeCase(description: string): Promise<any> {
  try {
    console.log('\n===== Starting Case Analysis =====');
    console.log('Input description length:', description.length);
    console.log('Description first 100 chars:', description.substring(0, 100));
    console.log('Request time:', new Date().toISOString());

    // Έλεγχος εγκυρότητας εισόδου
    if (!description || description.trim().length === 0) {
      console.error('Error: Empty description provided');
      throw new Error('Description cannot be empty');
    }

    // Χρήση του AI για ανάλυση
    console.log('\nCalling AI service (analyzeDocument)...');
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 'undefined');
    
    const startTime = Date.now();
    const aiAnalysis = await analyzeDocument(description);
    const endTime = Date.now();
    
    console.log('\nAI Analysis completed successfully');
    console.log('Processing time:', (endTime - startTime) / 1000, 'seconds');
    console.log('Analysis fields:', Object.keys(aiAnalysis));
    console.log('Summary length:', aiAnalysis.summary?.length || 0);

    // Εξαγωγή κλειδιών και έλεγχος εγκυρότητας απάντησης
    if (!aiAnalysis || typeof aiAnalysis !== 'object') {
      console.error('Error: Invalid AI analysis response');
      console.error('Response type:', typeof aiAnalysis);
      throw new Error('Invalid analysis response from AI service');
    }

    console.log('\n===== Case Analysis Complete =====');
    return {
      analysis: aiAnalysis
    };
  } catch (error: any) {
    console.error('\n===== Case Analysis Error =====');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Time of error:', new Date().toISOString());
    
    // Επιστρέφουμε ένα αντικείμενο σφάλματος αντί να ρίξουμε εξαίρεση
    return {
      analysis: {
        summary: "Αδυναμία ανάλυσης κειμένου",
        details: `Σφάλμα: ${error.message}`,
        recommendations: ["Παρακαλώ ελέγξτε την σύνδεσή σας και προσπαθήστε ξανά."],
        references: [{
          id: "error_ref",
          title: "Τεχνικό σφάλμα",
          description: "Παρουσιάστηκε πρόβλημα κατά την ανάλυση του κειμένου."
        }],
        outcomes: [{
          id: "error_outcome",
          scenario: "Αποτυχία επεξεργασίας",
          probability: 1.0,
          reasoning: "Δεν ήταν δυνατή η ανάλυση του κειμένου λόγω τεχνικού σφάλματος."
        }]
      },
      error: true,
      message: error.message
    };
  }
} 