import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export type LegalReference = {
  id: string;
  title: string;
  description: string;
};

export type CaseOutcome = {
  id: string;
  scenario: string;
  probability: number;
  reasoning: string;
};

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
  // Helper function to get color based on probability
  const getProbabilityColor = (probability: number): string => {
    if (probability >= 70) return '#15803d'; // green-700
    if (probability >= 40) return '#b45309'; // amber-700
    return '#b91c1c'; // red-700
  };

  // Helper function to get background color based on probability
  const getProbabilityBgColor = (probability: number): string => {
    if (probability >= 70) return '#f0fdf4'; // green-50
    if (probability >= 40) return '#fffbeb'; // amber-50
    return '#fef2f2'; // red-50
  };

  // Check if advice and its properties exist to prevent runtime errors
  const hasRecommendations = advice && Array.isArray(advice.recommendations);
  const hasOutcomes = advice && Array.isArray(advice.outcomes);
  const hasReferences = advice && Array.isArray(advice.references);

  // Debug log
  console.log('LegalResult received:', 
    'advice=', advice ? 'yes' : 'no',
    'summary=', advice?.summary ? 'yes' : 'no',
    'details=', advice?.details ? 'yes' : 'no',
    'hasRecommendations=', hasRecommendations,
    'hasOutcomes=', hasOutcomes, 
    'hasReferences=', hasReferences);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Περίληψη Ανάλυσης</Text>
          <Text style={styles.cardDescription}>Βασικά σημεία της νομικής ανάλυσης της υπόθεσής σας</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.summary}>{advice?.summary || 'Δεν υπάρχει διαθέσιμη περίληψη'}</Text>
          <View style={styles.separator} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Αναλυτικές Πληροφορίες</Text>
            <Text style={styles.details}>{advice?.details || 'Δεν υπάρχουν διαθέσιμες λεπτομέρειες'}</Text>
          </View>
        </View>
      </View>

      {hasOutcomes && advice.outcomes.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Πιθανότητες Έκβασης</Text>
            <Text style={styles.cardDescription}>
              Αξιολόγηση πιθανοτήτων για διαφορετικά σενάρια της υπόθεσής σας
            </Text>
          </View>
          <View style={styles.cardContent}>
            {advice.outcomes.map((outcome) => (
              <View
                key={outcome.id}
                style={[
                  styles.outcome,
                  { backgroundColor: getProbabilityBgColor(outcome.probability) }
                ]}
              >
                <View style={styles.outcomeHeader}>
                  <Text style={styles.outcomeTitle}>{outcome.scenario}</Text>
                  <Text style={[
                    styles.probability,
                    { color: getProbabilityColor(outcome.probability) }
                  ]}>
                    {outcome.probability}%
                  </Text>
                </View>
                <Text style={styles.reasoning}>{outcome.reasoning}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Προτεινόμενες Ενέργειες</Text>
          <Text style={styles.cardDescription}>Συστάσεις για τα επόμενα βήματα</Text>
        </View>
        <View style={styles.cardContent}>
          {hasRecommendations && advice.recommendations.map((recommendation, index) => (
            <View key={`recommendation-${index}`} style={styles.recommendation}>
              <View style={styles.recommendationNumber}>
                <Text style={styles.recommendationNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
          {!hasRecommendations && (
            <Text>Δεν υπάρχουν διαθέσιμες προτάσεις</Text>
          )}
        </View>
      </View>

      {hasReferences && advice.references.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Σχετικές Νομικές Αναφορές</Text>
            <Text style={styles.cardDescription}>
              Άρθρα και νομολογία που σχετίζονται με την υπόθεσή σας
            </Text>
          </View>
          <View style={styles.cardContent}>
            <ScrollView style={styles.referencesContainer}>
              {advice.references.map((reference) => (
                <View key={reference.id} style={styles.reference}>
                  <View style={styles.referenceHeader}>
                    <Ionicons name="document-text" size={16} color="#1a365d" />
                    <Text style={styles.referenceTitle}>{reference.title}</Text>
                  </View>
                  <Text style={styles.referenceDescription}>
                    {reference.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.discussButton]}
          onPress={() => {
            router.push('/chat');
          }}
        >
          <Ionicons name="chatbubbles" size={20} color="white" />
          <Text style={styles.buttonText}>Συζήτησε για την υπόθεση</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onSaveCase}
          disabled={isSaving}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>
            {isSaving ? "Αποθήκευση..." : "Αποθήκευση Υπόθεσης"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Ionicons name="book" size={20} color="#1a365d" />
          <Text style={styles.secondaryButtonText}>Περισσότερες Πληροφορίες</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LegalResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },
  summary: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    color: '#4a5568',
  },
  outcome: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  outcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outcomeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  probability: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reasoning: {
    color: '#4a5568',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 54, 93, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendationNumberText: {
    color: '#1a365d',
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
  },
  referencesContainer: {
    maxHeight: 200,
  },
  reference: {
    marginBottom: 16,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  referenceDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#1a365d',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1a365d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1a365d',
    fontSize: 16,
    fontWeight: '600',
  },
  discussButton: {
    backgroundColor: '#1a73e8',
  },
}); 