import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/Card';

export type LegalReference = {
  id: string;
  title: string;
  description: string;
};

interface ReferencesCardProps {
  references: LegalReference[];
}

const ReferencesCard = ({ references }: ReferencesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Σχετικές Νομικές Αναφορές</CardTitle>
        <CardDescription>Άρθρα και νομολογία που σχετίζονται με την υπόθεσή σας</CardDescription>
      </CardHeader>
      <CardContent>
        <View style={styles.referencesContainer}>
          {references.map((reference) => (
            <View key={reference.id} style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <Ionicons name="document-text" size={16} color="#1a365d" />
                <Text style={styles.referenceTitle}>{reference.title}</Text>
              </View>
              <Text style={styles.referenceDescription}>
                {reference.description}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  referencesContainer: {
    gap: 16,
  },
  referenceItem: {
    gap: 8,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a365d',
  },
  referenceDescription: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 24,
  },
});

export default ReferencesCard; 