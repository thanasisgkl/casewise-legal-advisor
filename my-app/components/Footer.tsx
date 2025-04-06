import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={styles.footer}>
      <View style={[
        styles.container,
        isTablet && styles.tabletContainer
      ]}>
        <View style={[
          styles.logoContainer,
          isTablet && styles.tabletLogoContainer
        ]}>
          <Ionicons name="scale-outline" size={20} color="white" />
          <Text style={styles.logoText}>CaseWise</Text>
        </View>
        
        <View style={[
          styles.textContainer,
          isTablet && styles.tabletTextContainer
        ]}>
          <Text style={styles.disclaimer}>
            Η εφαρμογή παρέχει μόνο γενικές πληροφορίες και δεν αποτελεί νομική συμβουλή.
          </Text>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} CaseWise - Όλα τα δικαιώματα διατηρούνται
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1a365d',
    paddingVertical: 24,
    marginTop: 'auto',
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabletLogoContainer: {
    marginBottom: 0,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  tabletTextContainer: {
    alignItems: 'flex-end',
  },
  disclaimer: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  copyright: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Footer; 