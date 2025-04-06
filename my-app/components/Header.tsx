import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.logoContainer}>
            <Ionicons name="scale-outline" size={24} color="#1a365d" />
            <Text style={styles.logoText}>CaseWise</Text>
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={toggleMenu}
        >
          <Ionicons 
            name={isMenuOpen ? "close" : "menu"} 
            size={24} 
            color="#1a365d" 
          />
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.mobileMenu,
          {
            transform: [{ translateX: slideAnim }],
            width: Dimensions.get('window').width,
          }
        ]}
      >
        <View style={styles.mobileMenuContent}>
          <Link href="/" asChild>
            <TouchableOpacity 
              style={styles.mobileMenuItem}
              onPress={() => setIsMenuOpen(false)}
            >
              <Ionicons name="home-outline" size={20} color="#4a5568" />
              <Text style={styles.mobileMenuItemText}>Αρχική</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/new-case" asChild>
            <TouchableOpacity 
              style={styles.mobileMenuItem}
              onPress={() => setIsMenuOpen(false)}
            >
              <Ionicons name="book-outline" size={20} color="#4a5568" />
              <Text style={styles.mobileMenuItemText}>Νέα Υπόθεση</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/history" asChild>
            <TouchableOpacity 
              style={styles.mobileMenuItem}
              onPress={() => setIsMenuOpen(false)}
            >
              <Ionicons name="time-outline" size={20} color="#4a5568" />
              <Text style={styles.mobileMenuItemText}>Ιστορικό</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  menuButton: {
    padding: 8,
  },
  mobileMenu: {
    position: 'absolute',
    top: 56,
    left: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  mobileMenuContent: {
    padding: 16,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  mobileMenuItemText: {
    fontSize: 16,
    color: '#4a5568',
  },
});

export default Header; 