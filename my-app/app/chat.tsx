import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Image, Alert, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'document';
    uri: string;
    name?: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Γεια σας! Είμαι το CaseWise Assistant. Πώς μπορώ να σας βοηθήσω με την υπόθεσή σας;',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Υπόθεση #1',
      lastMessage: 'Τελευταίο μήνυμα της συνομιλίας...',
      timestamp: new Date()
    }
  ]);

  const handleNewChat = () => {
    // Αποθηκεύουμε την τρέχουσα συνομιλία
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Υπόθεση #${conversations.length + 1}`,
      lastMessage: messages[messages.length - 1]?.text || 'Νέα συνομιλία',
      timestamp: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);

    // Καθαρίζουμε τα μηνύματα και προσθέτουμε το αρχικό μήνυμα
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: 'Γεια σας! Είμαι το CaseWise Assistant. Πώς μπορώ να σας βοηθήσω με την υπόθεσή σας;',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Καθαρίζουμε το input
    setInputText('');
  };

  useEffect(() => {
    // Scroll στο τέλος όταν αλλάζουν τα μηνύματα
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      Alert.alert('Σύντομα διαθέσιμο', 'Η φωνητική εισαγωγή θα είναι διαθέσιμη σε επόμενη έκδοση.');
      setIsRecording(false);
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Εμφάνιση μηνύματος φόρτωσης
    const loadingMessageId = Date.now().toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      text: 'Επεξεργασία της ερώτησής σας...',
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Κλήση στο API για ανάλυση
      const response = await fetch('http://192.168.1.3:3000/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: newMessage.text,
          // Δεν χρειάζεται να στείλουμε context, θα χρησιμοποιηθεί το τελευταίο context από το server
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Σφάλμα στην επεξεργασία της ερώτησης');
      }

      const data = await response.json();
      
      // Διαγραφή του μηνύματος φόρτωσης
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      // Προσθήκη της απάντησης στη συνομιλία
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.answer || 'Δεν μπόρεσα να απαντήσω στην ερώτησή σας. Παρακαλώ δοκιμάστε ξανά.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Διαγραφή του μηνύματος φόρτωσης
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      // Προσθήκη μηνύματος σφάλματος
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Συγγνώμη, αντιμετωπίζω πρόβλημα στην επεξεργασία της ερώτησής σας. Παρακαλώ δοκιμάστε ξανά αργότερα.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: false
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Έγγραφο: ' + asset.name,
          isUser: true,
          timestamp: new Date(),
          attachment: {
            type: 'document',
            uri: asset.uri,
            name: asset.name
          }
        };
        setMessages(prev => [...prev, newMessage]);
      }
      setIsAttachmentModalOpen(false);
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Χρειαζόμαστε άδεια για την κάμερα');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Φωτογραφία από κάμερα',
          isUser: true,
          timestamp: new Date(),
          attachment: {
            type: 'image',
            uri: asset.uri
          }
        };
        setMessages(prev => [...prev, newMessage]);
      }
      setIsAttachmentModalOpen(false);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleImageLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Χρειαζόμαστε άδεια για τη βιβλιοθήκη φωτογραφιών');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Φωτογραφία από συλλογή',
          isUser: true,
          timestamp: new Date(),
          attachment: {
            type: 'image',
            uri: asset.uri
          }
        };
        setMessages(prev => [...prev, newMessage]);
      }
      setIsAttachmentModalOpen(false);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleDeleteConversation = (id: string) => {
    Alert.alert(
      'Διαγραφή συνομιλίας',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη συνομιλία;',
      [
        {
          text: 'Άκυρο',
          style: 'cancel'
        },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: () => {
            setConversations(prev => prev.filter(conv => conv.id !== id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.rootContainer}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1a365d',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          headerBackVisible: false,
          title: 'CaseWise',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setIsMenuOpen(true)}
            >
              <Ionicons name="reorder-three-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleNewChat}
            >
              <Ionicons name="create-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser && styles.userMessage
              ]}
            >
              {message.isUser ? (
                <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>Εσείς</Text>
                </View>
              ) : null}
              <Text style={styles.messageText}>
                {message.text}
              </Text>
              {message.attachment && (
                <View style={styles.attachmentPreview}>
                  {message.attachment.type === 'image' ? (
                    <Image 
                      source={{ uri: message.attachment.uri }} 
                      style={styles.attachmentImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.documentPreview}>
                      <Ionicons name="document" size={24} color="#ffffff" />
                      <Text style={styles.documentName} numberOfLines={1}>
                        {message.attachment.name}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity 
                style={styles.attachButton}
                onPress={() => setIsAttachmentModalOpen(true)}
              >
                <Ionicons name="add" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Μήνυμα στο CaseWise..."
                multiline
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.micButtonRecording]} 
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons 
                  name={isRecording ? "mic" : "mic-outline"} 
                  size={24} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                <Ionicons name="send" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Προηγούμενες Συνομιλίες</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsMenuOpen(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.conversationsList}>
              {conversations.map((conv) => (
                <View key={conv.id} style={styles.conversationItem}>
                  <TouchableOpacity 
                    style={styles.conversationContent}
                    onPress={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text style={styles.conversationTitle}>{conv.title}</Text>
                    <Text style={styles.conversationLastMessage}>{conv.lastMessage}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteConversation(conv.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={isAttachmentModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAttachmentModalOpen(false)}
      >
        <View style={styles.attachmentModalContainer}>
          <View style={styles.attachmentModalContent}>
            <View style={styles.attachmentModalHeader}>
              <Text style={styles.attachmentModalTitle}>Επιλογή αρχείου</Text>
              <TouchableOpacity 
                onPress={() => setIsAttachmentModalOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.attachmentOptions}>
              <TouchableOpacity 
                style={styles.attachmentOption}
                onPress={handleDocumentPick}
              >
                <Ionicons name="document-outline" size={32} color="#ffffff" />
                <Text style={styles.attachmentOptionText}>Έγγραφο</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.attachmentOption}
                onPress={handleCameraCapture}
              >
                <Ionicons name="camera-outline" size={32} color="#ffffff" />
                <Text style={styles.attachmentOptionText}>Κάμερα</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.attachmentOption}
                onPress={handleImageLibrary}
              >
                <Ionicons name="images-outline" size={32} color="#ffffff" />
                <Text style={styles.attachmentOptionText}>Συλλογή</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  container: {
    height: '100%',
    backgroundColor: '#1a365d',
  },
  scrollView: {
    height: '100%',
    backgroundColor: '#1a365d',
  },
  chatContent: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 90 : 60,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2c4a7c',
    backgroundColor: '#1a365d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 8,
  },
  headerButton: {
    padding: 4,
  },
  messageContainer: {
    marginBottom: 8,
    width: '100%',
  },
  userMessage: {
    marginTop: 8,
  },
  userNameContainer: {
    marginBottom: 2,
  },
  userName: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#ffffff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2c4a7c',
    borderRadius: 20,
    padding: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    maxHeight: 80,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    marginRight: 6,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    marginRight: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  sendButtonDisabled: {
    backgroundColor: '#334b78',
  },
  modalContainer: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '100%',
    backgroundColor: '#1a365d',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c4a7c',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  conversationsList: {
    height: '100%',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c4a7c',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  conversationLastMessage: {
    color: '#94a3b8',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  attachmentModalContainer: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  attachmentModalContent: {
    backgroundColor: '#1a365d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  attachmentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  attachmentModalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  attachmentOption: {
    alignItems: 'center',
  },
  attachmentOptionText: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 16,
  },
  attachmentPreview: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c4a7c',
    padding: 12,
    borderRadius: 8,
  },
  documentName: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  micButtonRecording: {
    backgroundColor: '#dc2626',
  },
});