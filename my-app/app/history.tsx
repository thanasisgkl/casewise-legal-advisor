import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import HistoryList, { CaseHistoryItem } from '../components/HistoryList';

// Δείγμα δεδομένων για την επίδειξη του component
const sampleCases: CaseHistoryItem[] = [
  {
    id: "1",
    title: "Διαφορά Εργατικού Δικαίου",
    category: "Εργατικό Δίκαιο",
    date: "29/03/2024",
    summary: "Υπόθεση σχετικά με αποζημίωση απόλυσης και δεδουλευμένες υπερωρίες."
  },
  {
    id: "2",
    title: "Αγωγή Αποζημίωσης",
    category: "Αστικό Δίκαιο",
    date: "28/03/2024",
    summary: "Διεκδίκηση αποζημίωσης για υλικές ζημιές από τροχαίο ατύχημα."
  },
  {
    id: "3",
    title: "Διαφορά Μισθώσεως",
    category: "Αστικό Δίκαιο",
    date: "27/03/2024",
    summary: "Καταγγελία σύμβασης μίσθωσης και διεκδίκηση οφειλόμενων μισθωμάτων."
  }
];

export default function History() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Ιστορικό Υποθέσεων",
          headerLargeTitle: true,
        }}
      />
      <HistoryList cases={sampleCases} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
}); 