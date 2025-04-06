import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

console.log('AI Service - Environment check:');
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeDocument(text: string) {
  try {
    console.log('\n=== Starting AI Analysis ===');
    console.log('Input text length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
    
    console.log('\nPreparing OpenAI request with model: gpt-4o-mini');
    console.log('Request initiated at:', new Date().toISOString());
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Είσαι ένας έμπειρος νομικός σύμβουλος. Ανάλυσε το παρακάτω νομικό έγγραφο και δώσε μια δομημένη απάντηση στη μορφή JSON με τα εξής πεδία:

{
  "summary": "Σύντομη περίληψη της υπόθεσης (τουλάχιστον 100 χαρακτήρες)",
  "details": "Λεπτομερής ανάλυση των νομικών ζητημάτων (τουλάχιστον 200 χαρακτήρες)",
  "recommendations": [
    "Λίστα με προτεινόμενες ενέργειες (τουλάχιστον 3 προτάσεις)"
  ],
  "references": [
    {
      "id": "ref_1",
      "title": "Τίτλος νομικής αναφοράς",
      "description": "Περιγραφή σχετικότητας"
    }
  ],
  "outcomes": [
    {
      "id": "outcome_1",
      "scenario": "Περιγραφή πιθανού σεναρίου",
      "probability": 75,
      "reasoning": "Αιτιολόγηση πιθανότητας"
    }
  ]
}

Σημαντικές οδηγίες:
1. Όλα τα πεδία είναι ΥΠΟΧΡΕΩΤΙΚΑ
2. Το 'probability' πρέπει να είναι αριθμός από 1 έως 100
3. Η λίστα 'recommendations' πρέπει να έχει τουλάχιστον 2 συστάσεις
4. Η λίστα 'outcomes' πρέπει να έχει τουλάχιστον 2 σενάρια
5. Φρόντισε η απάντησή σου να είναι ΠΑΝΤΑ έγκυρο JSON`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    console.log('\nOpenAI Response received at:', new Date().toISOString());
    console.log('Response status:', response.choices[0].finish_reason);
    console.log('Response length:', response.choices[0].message.content?.length || 0);

    if (!response.choices[0].message.content) {
      console.error('Error: No content in response');
      throw new Error('No response content from AI');
    }

    console.log('\nParsing JSON response...');
    try {
      const analysis = JSON.parse(response.choices[0].message.content);
      console.log('JSON parsed successfully');
      console.log('Analysis fields:', Object.keys(analysis));
      
      // Έλεγχος εγκυρότητας της απάντησης
      const requiredFields = ['summary', 'details', 'recommendations', 'references', 'outcomes'];
      const missingFields = requiredFields.filter(field => !analysis[field]);
      
      if (missingFields.length > 0) {
        console.warn('Warning: Missing required fields in AI response:', missingFields);
      }
      
      // Λεπτομερής καταγραφή των περιεχομένων
      console.log('Summary length:', analysis.summary?.length || 0);
      console.log('Details length:', analysis.details?.length || 0);
      console.log('Recommendations count:', Array.isArray(analysis.recommendations) ? analysis.recommendations.length : 0);
      console.log('References count:', Array.isArray(analysis.references) ? analysis.references.length : 0);
      console.log('Outcomes count:', Array.isArray(analysis.outcomes) ? analysis.outcomes.length : 0);
      
      // Διασφάλιση ότι έχουμε δομημένα δεδομένα (fallback σε κενούς πίνακες αν λείπουν)
      if (!Array.isArray(analysis.recommendations)) {
        console.warn('Recommendations field is not an array, setting to empty array');
        analysis.recommendations = [];
      }
      
      if (!Array.isArray(analysis.references)) {
        console.warn('References field is not an array, setting to empty array');
        analysis.references = [];
      }
      
      if (!Array.isArray(analysis.outcomes)) {
        console.warn('Outcomes field is not an array, setting to empty array');
        analysis.outcomes = [];
      }
      
      return analysis;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', response.choices[0].message.content);
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error: any) {
    console.error('\n=== AI Analysis Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error occurred at:', new Date().toISOString());
    
    if (error.response) {
      console.error('OpenAI Error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    // Επιστροφή ενός fallback JSON αντί για εξαίρεση
    console.log('Returning fallback analysis due to error');
    return {
      summary: "Δεν ήταν δυνατή η ανάλυση του κειμένου. Παρουσιάστηκε σφάλμα επικοινωνίας με το OpenAI API.",
      details: `Λεπτομέρειες σφάλματος: ${error.message}`,
      recommendations: ["Παρακαλώ ελέγξτε την σύνδεσή σας και προσπαθήστε ξανά."],
      references: [{
        id: "error_ref",
        title: "Σφάλμα επικοινωνίας",
        description: "Παρουσιάστηκε πρόβλημα κατά την επικοινωνία με την υπηρεσία AI."
      }],
      outcomes: [{
        id: "error_outcome",
        scenario: "Αποτυχία ανάλυσης",
        probability: 1.0,
        reasoning: "Δεν ήταν δυνατή η ανάλυση του κειμένου λόγω τεχνικού σφάλματος."
      }]
    };
  }
}

export async function askQuestion(context: string, question: string) {
  try {
    console.log('\n=== Starting Question Analysis ===');
    console.log('Context length:', context.length);
    console.log('Question:', question);
    console.log('Using model: gpt-4o-mini');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Είσαι ένας έμπειρος νομικός σύμβουλος. Απάντησε στην ερώτηση με βάση το context που δίνεται.
          Η απάντησή σου πρέπει να είναι:
          1. Συγκεκριμένη και τεκμηριωμένη
          2. Να αναφέρει σχετικά άρθρα νόμων όπου χρειάζεται
          3. Να προτείνει συγκεκριμένες ενέργειες
          4. Να επισημαίνει πιθανούς κινδύνους`
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nΕρώτηση: ${question}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    console.log('\nQuestion Response received');
    console.log('Response status:', response.choices[0].finish_reason);
    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('\n=== Question Analysis Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    return `Σφάλμα κατά την επικοινωνία με την υπηρεσία AI: ${error.message}`;
  }
} 