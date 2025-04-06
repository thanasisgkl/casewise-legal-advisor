import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

interface CaseDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CaseDescription = ({
  value,
  onChange,
  onSubmit,
  isSubmitting
}: CaseDescriptionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [userComments, setUserComments] = useState('');
  
  const minLength = 50;
  const idealLength = 200;
  const currentLength = userComments.length;
  const progress = Math.min(100, (currentLength / idealLength) * 100);

  const handleSuccessfulAnalysis = (text: string, analysisData = null) => {
    // Αφαίρεση των σχολίων χρήστη από το κείμενο αν υπάρχουν
    let cleanText = text;
    const commentsIndex = text.indexOf('\n\nΣχόλια χρήστη:');
    if (commentsIndex !== -1) {
      cleanText = text.substring(0, commentsIndex);
      console.log('Σχόλια χρήστη αφαιρέθηκαν από το κείμενο για ανάλυση');
      console.log('Καθαρό κείμενο (χωρίς σχόλια) μήκους:', cleanText.length);
    }
    
    // Μετά από επιτυχή ανάλυση, πρώτα ενημερώνουμε το κείμενο
    onChange(cleanText);
    
    // Αν έχουμε ήδη την ανάλυση, προχωρούμε στα αποτελέσματα
    if (analysisData) {
      console.log('Analysis data already available, redirecting to results');
      router.push('/case/new');
      return;
    }
    
    // Στέλνουμε τα δεδομένα για ανάλυση (χωρίς τα σχόλια χρήστη)
    fetch('http://192.168.1.3:3000/api/cases/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: cleanText }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Αποτυχία ανάλυσης κειμένου');
      }
      return response.json();
    })
    .then(data => {
      console.log('Analysis completed, redirecting to results');
      // Μεταφορά στη σελίδα ανάλυσης
      router.push('/case/new');
    })
    .catch(error => {
      console.error('Error during analysis:', error);
      Alert.alert('Σφάλμα', 'Υπήρξε πρόβλημα κατά την ανάλυση του κειμένου.');
    });
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result);
        // Αυτόματη ανάλυση του αρχείου
        const formData = new FormData();
        const fileType = result.assets[0].mimeType ?? 'application/pdf';
        
        // Δημιουργία του file object
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;

        // Προσθήκη του αρχείου στο FormData
        formData.append('file', {
          uri: fileUri,
          type: fileType,
          name: fileName
        } as any);

        console.log('Sending file:', {
          uri: fileUri,
          type: fileType,
          name: fileName
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);

        try {
          const response = await fetch('http://192.168.1.3:3000/api/analyze', {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Αποτυχία ανάλυσης αρχείου' }));
            console.error('Server response:', errorData);
            throw new Error(errorData.error || 'Αποτυχία ανάλυσης αρχείου');
          }

          const data = await response.json();
          console.log('Server response:', data);
          
          if (!data.text) {
            throw new Error('Δεν βρέθηκε κείμενο στο αρχείο');
          }

          // Έλεγχος για απευθείας ανάλυση από το νέο endpoint
          if (data.analysis) {
            console.log('Analysis data received directly from OCR API');
            console.log('Analysis summary length:', data.analysis.summary?.length || 0);
          }

          // Handle successful analysis - πέρασε και την ανάλυση αν υπάρχει
          handleSuccessfulAnalysis(data.text, data.analysis);
          Alert.alert('Επιτυχία', 'Το αρχείο αναλύθηκε επιτυχώς. Μεταφορά στην οθόνη ανάλυσης...');
          setUserComments('');
        } catch (error: any) {
          if (error.name === 'AbortError') {
            throw new Error('Το αίτημα έληξε. Παρακαλώ δοκιμάστε ξανά.');
          }
          throw error;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Σφάλμα', 'Υπήρξε πρόβλημα κατά την ανάλυση του αρχείου. Βεβαιωθείτε ότι το backend είναι προσβάσιμο.');
    }
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Σφάλμα', 'Χρειαζόμαστε άδεια πρόσβασης στη βιβλιοθήκη φωτογραφιών.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Δημιουργία του FormData
        const formData = new FormData();
        const fileUri = result.assets[0].uri;
        const fileName = fileUri.split('/').pop() ?? 'image.jpg';

        formData.append('file', {
          uri: fileUri,
          type: 'image/jpeg',
          name: fileName
        } as any);

        console.log('Sending image:', {
          uri: fileUri,
          type: 'image/jpeg',
          name: fileName
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);

        try {
          const response = await fetch('http://192.168.1.3:3000/api/analyze', {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Αποτυχία ανάλυσης εικόνας' }));
            console.error('Server response:', errorData);
            throw new Error(errorData.error || 'Αποτυχία ανάλυσης εικόνας');
          }

          const data = await response.json();
          console.log('Server response:', data);
          
          // Διαγνωστική εκτύπωση
          console.log('======= OCR RESPONSE DATA =======');
          console.log('Extracted text length:', data.text?.length || 0);
          if (data.text) {
            console.log('First 100 chars:', data.text.substring(0, 100));
          }
          if (data.analysis) {
            console.log('Analysis data received directly from OCR API');
            console.log('Analysis summary length:', data.analysis.summary?.length || 0);
          }
          console.log('==================================');
          
          if (!data.text) {
            throw new Error('Δεν βρέθηκε κείμενο στην εικόνα');
          }

          // Handle successful analysis - πέρασε και την ανάλυση αν υπάρχει
          handleSuccessfulAnalysis(data.text, data.analysis);
          
          // Μετά από την onChange, έλεγχος αν το κείμενο ενημερώθηκε
          console.log('Value updated to text length:', data.text.length);
          
          Alert.alert('Επιτυχία', 'Η εικόνα αναλύθηκε επιτυχώς. Μεταφορά στην οθόνη ανάλυσης...');
          setUserComments('');
        } catch (error: any) {
          if (error.name === 'AbortError') {
            throw new Error('Το αίτημα έληξε. Παρακαλώ δοκιμάστε ξανά.');
          }
          throw error;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Σφάλμα', 'Υπήρξε πρόβλημα κατά την ανάλυση της εικόνας. Βεβαιωθείτε ότι το backend είναι προσβάσιμο.');
    }
  };

  const handleSubmit = () => {
    if (userComments.trim()) {
      // Αν υπάρχουν σχόλια χρήστη, τα προσθέτουμε στο τέλος του OCR κειμένου
      const updatedText = value + '\n\nΣχόλια χρήστη:\n' + userComments.trim();
      
      // Έλεγχος των σχολίων που προστίθενται
      console.log('======= SUBMITTING WITH COMMENTS =======');
      console.log('Original text length:', value.length);
      console.log('Comments length:', userComments.trim().length);
      console.log('Final text length:', updatedText.length);
      console.log('==========================================');
      
      // Στέλνουμε το ενημερωμένο κείμενο για ανάλυση
      handleSuccessfulAnalysis(updatedText);
    } else if (value.trim()) {
      // Αν δεν υπάρχουν σχόλια αλλά υπάρχει κείμενο, στέλνουμε για ανάλυση
      handleSuccessfulAnalysis(value);
    } else {
      Alert.alert('Σφάλμα', 'Παρακαλώ ανεβάστε ένα έγγραφο ή προσθέστε κείμενο πριν την υποβολή.');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.scanButton, styles.buttonFlex]}
          onPress={handleFilePick}
        >
          <Text style={styles.scanButtonText}>
            {selectedFile ? 'Αλλαγή Αρχείου' : 'Επιλογή PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanButton, styles.buttonFlex]}
          onPress={handleImagePick}
        >
          <Text style={styles.scanButtonText}>
            Επιλογή από Βιβλιοθήκη
          </Text>
        </TouchableOpacity>
      </View>
      
      {selectedFile && !selectedFile.canceled && (
        <Text style={styles.fileName}>
          Επιλεγμένο αρχείο: {selectedFile.assets[0].name}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Μιλήστε μας για την υπόθεση:</Text>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused
          ]}
          placeholder="Περιγράψτε την υπόθεσή σας με όσο το δυνατόν περισσότερες λεπτομέρειες..."
          value={userComments}
          onChangeText={setUserComments}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          textAlignVertical="top"
          numberOfLines={8}
        />
        
        {(isFocused || currentLength > 0) && (
          <Text style={styles.characterCount}>
            {currentLength} / {idealLength}+ χαρακτήρες
          </Text>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            Ελάχιστο: {minLength} χαρακτήρες
          </Text>
          <Text style={styles.progressLabel}>
            Ιδανικό: {idealLength}+ χαρακτήρες
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${progress}%` }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (currentLength < minLength || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={currentLength < minLength || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Γίνεται Ανάλυση...' : 'Ανάλυση Υπόθεσης'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: '#1a365d',
  },
  characterCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    color: '#64748b',
  },
  progressContainer: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a365d',
  },
  submitButton: {
    backgroundColor: '#1a365d',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#1a365d',
    fontSize: 16,
    fontWeight: '500',
  },
  fileName: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 8,
  }
});

export default CaseDescription; 