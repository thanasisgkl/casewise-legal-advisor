import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/Card';

interface RecommendationsCardProps {
  recommendations: string[];
}

const RecommendationsCard = ({ recommendations }: RecommendationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Προτεινόμενες Ενέργειες</CardTitle>
        <CardDescription>Συστάσεις για τα επόμενα βήματα</CardDescription>
      </CardHeader>
      <CardContent>
        <View style={styles.recommendationsContainer}>
          {recommendations.map((recommendation, index) => (
            <View key={`recommendation-${recommendation.substring(0, 20)}-${index}`} style={styles.recommendationItem}>
              <View style={styles.recommendationNumber}>
                <Text style={styles.recommendationNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  recommendationsContainer: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1a365d20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  recommendationNumberText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a365d',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
});

export default RecommendationsCard; 