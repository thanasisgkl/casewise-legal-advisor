import { Image, StyleSheet, Platform, Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [text, setText] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε κείμενο για ανάλυση');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      console.log('Sending request to backend...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

      const response = await fetch('http://192.168.1.3:3000/api/cases/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Σφάλμα στην ανάλυση');
      }

      const data = await response.json();
      console.log('Received response from backend:', data);
      
      // Διαγνωστική εκτύπωση
      console.log('======= ANALYSIS RESPONSE DATA =======');
      console.log('Type of data:', typeof data);
      console.log('Type of data.analysis:', typeof data.analysis);
      console.log('Keys in data:', Object.keys(data));
      console.log('Keys in data.analysis:', data.analysis ? Object.keys(data.analysis) : 'null');
      if (data.analysis && data.analysis.summary) {
        console.log('Summary preview:', data.analysis.summary.substring(0, 50) + '...');
      }
      console.log('=====================================');
      
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Η ανάλυση πήρε πολύ χρόνο. Παρακαλώ δοκιμάστε ξανά.');
        } else if (error.message.includes('Network request failed')) {
          setError('Δεν ήταν δυνατή η σύνδεση με τον server. Παρακαλώ ελέγξτε την σύνδεσή σας στο διαδίκτυο.');
        } else if (error.message.includes('Failed to analyze case')) {
          setError('Σφάλμα στην ανάλυση του κειμένου. Παρακαλώ δοκιμάστε ξανά.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Σφάλμα στην ανάλυση');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Καλώς ήρθατε στο CaseWise</Text>
        <Text style={styles.subtitle}>Ανάλυση νομικών υποθέσεων</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Εισάγετε το κείμενο της υπόθεσης..."
            value={text}
            onChangeText={setText}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Ανάλυση...' : 'Ανάλυση'}
          </Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {analysis && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>Αποτελέσματα Ανάλυσης:</Text>
            <Text style={styles.analysisText}>{typeof analysis === 'object' ? JSON.stringify(analysis, null, 2) : analysis}</Text>
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffcccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  analysisContainer: {
    backgroundColor: '#ccffcc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 16,
  },
  headerImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
});
