import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import SummaryCard from './components/SummaryCard';
import OutcomesCard from './components/OutcomesCard';
import RecommendationsCard from './components/RecommendationsCard';
import ReferencesCard from './components/ReferencesCard';
import type { CaseOutcome } from './components/OutcomesCard';
import type { LegalReference } from './components/ReferencesCard';

export type LegalAdvice = {
  summary: string;
  details: string;
  recommendations: string[];
  references: LegalReference[];
  outcomes: CaseOutcome[];
};

interface LegalResultProps {
  advice: LegalAdvice;
  onSaveCase: () => void;
  isSaving: boolean;
}

const LegalResult = ({ advice, onSaveCase, isSaving }: LegalResultProps) => {
  // Debug logs για να βλέπουμε τα δεδομένα που φτάνουν στο component
  useEffect(() => {
    console.log('====== LegalResult Component ======');
    console.log('Advice data received:', {
      type: typeof advice,
      keys: Object.keys(advice),
      summaryLength: advice.summary?.length || 0,
      detailsLength: advice.details?.length || 0,
      recommendationsCount: advice.recommendations?.length || 0,
      referencesCount: advice.references?.length || 0,
      outcomesCount: advice.outcomes?.length || 0
    });
    
    if (advice.outcomes?.length > 0) {
      console.log('First outcome:', {
        scenario: advice.outcomes[0].scenario,
        probability: advice.outcomes[0].probability
      });
    }
    console.log('==================================');
  }, [advice]);

  return (
    <View style={styles.container}>
      <SummaryCard summary={advice.summary} details={advice.details} />
      <OutcomesCard outcomes={advice.outcomes} />
      <RecommendationsCard recommendations={advice.recommendations} />
      <ReferencesCard references={advice.references} />

      <View style={styles.buttonContainer}>
        <Button
          variant="default"
          onPress={onSaveCase}
          disabled={isSaving}
          style={styles.button}
        >
          <Ionicons name="add-circle-outline" size={16} color="white" style={styles.buttonIcon} />
          {isSaving ? 'Αποθήκευση...' : 'Αποθήκευση Υπόθεσης'}
        </Button>

        <Button
          variant="outline"
          style={styles.button}
        >
          <Ionicons name="book-outline" size={16} color="#1a365d" style={styles.buttonIcon} />
          Περισσότερες Πληροφορίες
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default LegalResult; 