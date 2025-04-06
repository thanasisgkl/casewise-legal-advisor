import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSignOut: () => void;
  isHomeScreen: boolean;
  isCaseScreen: boolean;
  isHistoryScreen: boolean;
  isSettingsScreen: boolean;
}

const HeaderMenu = ({
  isOpen,
  onClose,
  onNavigate,
  onSignOut,
  isHomeScreen,
  isCaseScreen,
  isHistoryScreen,
  isSettingsScreen,
}: HeaderMenuProps) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Μενού</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1a365d" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity
              style={[styles.menuItem, isHomeScreen && styles.activeMenuItem]}
              onPress={() => onNavigate('/')}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={isHomeScreen ? '#1a365d' : '#64748b'}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isHomeScreen && styles.activeMenuItemText,
                ]}
              >
                Αρχική
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, isCaseScreen && styles.activeMenuItem]}
              onPress={() => onNavigate('/case')}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={isCaseScreen ? '#1a365d' : '#64748b'}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isCaseScreen && styles.activeMenuItemText,
                ]}
              >
                Νέα Υπόθεση
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, isHistoryScreen && styles.activeMenuItem]}
              onPress={() => onNavigate('/history')}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={isHistoryScreen ? '#1a365d' : '#64748b'}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isHistoryScreen && styles.activeMenuItemText,
                ]}
              >
                Ιστορικό
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, isSettingsScreen && styles.activeMenuItem]}
              onPress={() => onNavigate('/settings')}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={isSettingsScreen ? '#1a365d' : '#64748b'}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isSettingsScreen && styles.activeMenuItemText,
                ]}
              >
                Ρυθμίσεις
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Αποσύνδεση</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    width: '80%',
    height: '100%',
    padding: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  menuItems: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  activeMenuItem: {
    backgroundColor: '#f1f5f9',
  },
  menuItemText: {
    fontSize: 16,
    color: '#64748b',
  },
  activeMenuItemText: {
    color: '#1a365d',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginTop: 'auto',
  },
  signOutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
});

export default HeaderMenu; 