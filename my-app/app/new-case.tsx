import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CategorySelect from '../components/CaseForm/CategorySelect';
import CaseDescription from '../components/CaseDescription';
import categories, { Category } from './categories';

export default function NewCase() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (description.length < 50) {
      Alert.alert('Σφάλμα', 'Η περιγραφή πρέπει να είναι τουλάχιστον 50 χαρακτήρες.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://192.168.1.3:3000/api/cases/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: description,
          categories: selectedCategories
        }),
      });

      if (!response.ok) {
        throw new Error('Αποτυχία δημιουργίας υπόθεσης');
      }

      const newCase = await response.json();
      router.push(`/case/${newCase.id}`);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Σφάλμα', 'Υπήρξε πρόβλημα κατά την ανάλυση της υπόθεσης. Βεβαιωθείτε ότι το backend είναι προσβάσιμο.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CategorySelect
          selectedCategories={selectedCategories}
          onSelect={setSelectedCategories}
        />
        <CaseDescription
          value={description}
          onChange={setDescription}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    gap: 24,
  },
}); 