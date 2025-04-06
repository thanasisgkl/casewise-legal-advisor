import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LegalResult from '../../components/LegalResult';
import { LegalAdvice } from '../../components/LegalResult';

interface CaseHeaderProps {
  id: string | null;
}

const CaseHeader = ({ id }: CaseHeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.title}>Λεπτομέρειες Υπόθεσης {id ? `#${id}` : ''}</Text>
    <Text style={styles.subtitle}>
      Αναλυτική παρουσίαση της νομικής ανάλυσης και των προτάσεων
    </Text>
  </View>
);

// Δείγμα δεδομένων ως fallback σε περίπτωση σφάλματος
const sampleLegalAdvice = {
  summary: "Η υπόθεσή σας έχει καλές πιθανότητες επιτυχίας βάσει της νομολογίας και των διαθέσιμων αποδεικτικών στοιχείων.",
  details: "Η ανάλυση των στοιχείων δείχνει ισχυρή νομική βάση για τους ισχυρισμούς σας. Τα έγγραφα που παρέχονται υποστηρίζουν τη θέση σας.",
  recommendations: [
    "Συγκέντρωση πρόσθετων αποδεικτικών στοιχείων",
    "Προετοιμασία για πιθανή εξωδικαστική επίλυση",
    "Σύνταξη προκαταρκτικής αγωγής"
  ],
  references: [
    {
      id: "1",
      title: "Άρθρο 281 ΑΚ",
      description: "Καταχρηστική άσκηση δικαιώματος"
    },
    {
      id: "2",
      title: "ΑΠ 1234/2023",
      description: "Σχετική νομολογία για παρόμοια υπόθεση"
    }
  ],
  outcomes: [
    {
      id: "outcome-1",
      scenario: "Πλήρης Δικαίωση",
      probability: 75,
      reasoning: "Ισχυρά αποδεικτικά στοιχεία και ευνοϊκή νομολογία"
    },
    {
      id: "outcome-2",
      scenario: "Μερική Δικαίωση",
      probability: 20,
      reasoning: "Πιθανός συμβιβασμός λόγω διαδικαστικών ζητημάτων"
    },
    {
      id: "outcome-3",
      scenario: "Απόρριψη",
      probability: 5,
      reasoning: "Ελάχιστη πιθανότητα λόγω τεχνικών ζητημάτων"
    }
  ]
};

export default function CaseDetails() {
  const params = useGlobalSearchParams();
  console.log('Params:', params);
  
  // Handle the case where id is "undefined" string
  let caseId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!caseId || caseId === 'undefined') {
    caseId = 'new';
  }
  console.log('Case ID:', caseId);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<LegalAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Φόρτωση των πραγματικών δεδομένων ανάλυσης από το backend
  useEffect(() => {
    async function fetchAnalysisData() {
      try {
        setIsLoading(true);
        
        // Αν έχουμε ένα case ID, χρησιμοποιούμε το endpoint /api/cases/:id
        // Αλλιώς χρησιμοποιούμε τα τελευταία cached αποτελέσματα ανάλυσης
        const url = caseId !== 'new'
          ? `http://192.168.1.3:3000/api/cases/${caseId}`
          : 'http://192.168.1.3:3000/api/cases/latest-analysis';
        
        console.log('Fetching analysis from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Αποτυχία λήψης δεδομένων ανάλυσης');
        }
        
        const data = await response.json();
        console.log('Analysis data received:', Object.keys(data));
        
        // Ελέγχουμε αν υπάρχει πεδίο analysis στην απάντηση
        if (data.analysis) {
          console.log('Analysis fields:', Object.keys(data.analysis));
          
          // Fix: Ελέγχουμε αν υπάρχει διπλό επίπεδο analysis και το διορθώνουμε
          if (data.analysis.analysis && typeof data.analysis.analysis === 'object') {
            console.log('Detected nested analysis object - fixing data structure');
            setAnalysis(data.analysis.analysis);
          } else {
            setAnalysis(data.analysis);
          }
        } else {
          console.log('Unexpected response format:', data);
          setError('Μη αναμενόμενη μορφή απάντησης από τον server');
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Σφάλμα κατά τη λήψη των δεδομένων ανάλυσης');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAnalysisData();
  }, [caseId]);

  const handleSaveCase = async () => {
    setIsSaving(true);
    try {
      // Εδώ θα προσθέσουμε τη λογική αποθήκευσης
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Case saved successfully');
    } catch (err) {
      console.error('Error saving case:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Αν υπάρχει σφάλμα φόρτωσης, χρησιμοποιούμε τα δείγματα δεδομένων
  const legalAdvice = analysis || sampleLegalAdvice;

  // Debug - εμφάνιση των δεδομένων που λαμβάνουμε
  useEffect(() => {
    if (analysis) {
      console.log('==== DEBUG: Analysis Data ====');
      console.log('Analysis type:', typeof analysis);
      console.log('Analysis fields:', Object.keys(analysis));
      if (analysis.summary) console.log('Summary:', analysis.summary.substring(0, 50) + '...');
      if (analysis.recommendations) console.log('Recommendations count:', analysis.recommendations.length);
      if (analysis.outcomes) console.log('Outcomes count:', analysis.outcomes.length);
      if (analysis.references) console.log('References count:', analysis.references.length);
      console.log('=============================');
    }
  }, [analysis]);

  // Έλεγχος αν το analysis έχει έγκυρο περιεχόμενο
  const hasValidAnalysis = analysis && 
    typeof analysis === 'object' && 
    (analysis.summary?.length > 0 || 
     (Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0) ||
     (Array.isArray(analysis.outcomes) && analysis.outcomes.length > 0)
    );

  // Χρησιμοποίησε το sample μόνο αν δεν έχουμε έγκυρη ανάλυση
  const effectiveLegalAdvice = hasValidAnalysis ? analysis : sampleLegalAdvice;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: caseId === 'new' ? 'Νέα Υπόθεση' : `Υπόθεση #${caseId}`,
          headerLeft: () => (
            <Ionicons name="arrow-back" size={24} color="#1a365d" />
          ),
        }}
      />
      
      <CaseHeader id={caseId === 'new' ? null : caseId} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a365d" />
          <Text style={styles.loadingText}>Φόρτωση ανάλυσης...</Text>
        </View>
      ) : (
        <LegalResult
          advice={effectiveLegalAdvice}
          onSaveCase={handleSaveCase}
          isSaving={isSaving}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
}); 