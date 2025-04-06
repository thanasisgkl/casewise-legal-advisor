import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="scale" size={64} color="#1a365d" />
        </View>
        
        <Text style={styles.title}>CaseWise</Text>
        <Text style={styles.description}>
          Ο προσωπικός σας νομικός σύμβουλος που αναλύει την υπόθεσή σας και παρέχει εξατομικευμένες συμβουλές με βάση την ελληνική νομοθεσία.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/new-case')}
          >
            <Ionicons name="document-text" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Δημιουργία Νέας Υπόθεσης</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/history')}
          >
            <Ionicons name="time" size={20} color="#1a365d" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Προβολή Ιστορικού</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Πώς Λειτουργεί</Text>
        
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons name="document-text" size={32} color="#1a365d" />
            </View>
            <Text style={styles.stepTitle}>1. Εισάγετε την υπόθεσή σας</Text>
            <Text style={styles.stepDescription}>
              Περιγράψτε την υπόθεσή σας με όσο το δυνατόν περισσότερες λεπτομέρειες.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons name="sparkles" size={32} color="#1a365d" />
            </View>
            <Text style={styles.stepTitle}>2. Λάβετε ανάλυση</Text>
            <Text style={styles.stepDescription}>
              Το σύστημα αναλύει την υπόθεση και παρέχει εξατομικευμένες νομικές συμβουλές.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons name="book" size={32} color="#1a365d" />
            </View>
            <Text style={styles.stepTitle}>3. Δείτε τις προτάσεις</Text>
            <Text style={styles.stepDescription}>
              Λάβετε συγκεκριμένες προτάσεις και παραπομπές σε σχετική νομοθεσία.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a365d',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#1a365d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a365d',
  },
  buttonIcon: {
    marginRight: 8,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    gap: 24,
  },
  step: {
    alignItems: 'center',
  },
  stepIcon: {
    backgroundColor: 'rgba(26, 54, 93, 0.1)',
    borderRadius: 50,
    padding: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
}); 