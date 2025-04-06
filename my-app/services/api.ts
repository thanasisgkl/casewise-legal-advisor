import axios from 'axios';

// Χρησιμοποιούμε την τοπική IP διεύθυνση αντί για localhost
const API_URL = 'http://192.168.1.3:3000/api';

export interface CaseData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  documents: {
    name: string;
    uri: string;
    mimeType: string;
    size: number;
  }[];
}

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

export const api = {
  // Δημιουργία νέας υπόθεσης
  createCase: async (caseData: CaseData) => {
    console.log('API: Creating new case', { title: caseData.title });
    const response = await axios.post(`${API_URL}/cases`, caseData);
    console.log('API: Case created response', response.status);
    return response.data;
  },

  // Λήψη ανάλυσης υπόθεσης
  getCaseAnalysis: async (caseId: string) => {
    console.log('API: Getting case analysis for', caseId);
    const response = await axios.get(`${API_URL}/cases/${caseId}`);
    console.log('API: Get analysis response', response.status);
    return response.data;
  },

  // Ανάλυση νέας υπόθεσης
  analyzeCase: async (caseData: CaseData): Promise<LegalAnalysis> => {
    console.log('API: Analyzing case with description length', caseData.description.length);
    console.log('API: Request URL', `${API_URL}/cases/analyze`);
    
    try {
      const response = await axios.post(`${API_URL}/cases/analyze`, { text: caseData.description });
      
      console.log('API: Analysis response status', response.status);
      console.log('API: Response data type', typeof response.data);
      console.log('API: Response data keys', Object.keys(response.data));
      
      if (response.data && response.data.analysis) {
        console.log('API: Analysis data keys', Object.keys(response.data.analysis));
        console.log('API: Summary length', response.data.analysis.summary?.length || 0);
        return response.data.analysis;
      } else {
        console.error('API: Unexpected response format', response.data);
        throw new Error('Μη αναμενόμενη μορφή απάντησης από τον server');
      }
    } catch (error) {
      console.error('API: Error in analyzeCase', error);
      throw error;
    }
  }
}; 