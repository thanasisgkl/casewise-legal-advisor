import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/Card';
import { useProbabilityColors } from '../../../hooks/useProbabilityColors';

export type CaseOutcome = {
  scenario: string;
  probability: number;
  reasoning: string;
};

interface OutcomesCardProps {
  outcomes: CaseOutcome[];
}

const OutcomeItem = ({ outcome }: { outcome: CaseOutcome }) => {
  const colors = useProbabilityColors(outcome.probability);
  
  return (
    <View
      key={`outcome-${outcome.scenario}`}
      style={[
        styles.outcomeCard,
        { backgroundColor: colors.backgroundColor },
      ]}
    >
      <View style={styles.outcomeHeader}>
        <Text style={styles.outcomeTitle}>{outcome.scenario}</Text>
        <Text
          style={[
            styles.outcomeProbability,
            { color: colors.textColor },
          ]}
        >
          {outcome.probability}%
        </Text>
      </View>
      <Text style={styles.outcomeReasoning}>{outcome.reasoning}</Text>
    </View>
  );
};

const OutcomesCard = ({ outcomes }: OutcomesCardProps) => {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Πιθανότητες Έκβασης</CardTitle>
        <CardDescription>Αξιολόγηση πιθανοτήτων για διαφορετικά σενάρια της υπόθεσής σας</CardDescription>
      </CardHeader>
      <CardContent>
        <View style={styles.outcomesContainer}>
          {outcomes.map((outcome) => (
            <OutcomeItem key={outcome.scenario} outcome={outcome} />
          ))}
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  outcomesContainer: {
    gap: 16,
  },
  outcomeCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#1a365d',
  },
  outcomeProbability: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  outcomeReasoning: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default OutcomesCard; 