import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/Card';
import { sharedStyles } from '../../../styles/shared';

interface SummaryCardProps {
  summary: string;
  details: string;
}

const SummaryCard = ({ summary, details }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Περίληψη Ανάλυσης</CardTitle>
        <CardDescription>Βασικά σημεία της νομικής ανάλυσης της υπόθεσής σας</CardDescription>
      </CardHeader>
      <CardContent>
        <Text style={styles.summaryText}>{summary}</Text>
        <View style={styles.separator} />
        <View style={styles.detailsContainer}>
          <Text style={sharedStyles.title}>Αναλυτικές Πληροφορίες</Text>
          <Text style={sharedStyles.text}>{details}</Text>
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a365d',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  detailsContainer: {
    gap: 16,
  },
});

export default SummaryCard; 