import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeader } from './hooks/useHeader';
import HeaderMenu from './components/HeaderMenu';
import HeaderSearch from './components/HeaderSearch';

const Header = () => {
  const {
    isMenuOpen,
    isSearchOpen,
    searchQuery,
    isHomeScreen,
    isCaseScreen,
    isHistoryScreen,
    isSettingsScreen,
    handleMenuToggle,
    handleSearchToggle,
    handleSearch,
    handleSignOut,
    handleNavigate,
    setSearchQuery,
  } = useHeader();

  const getHeaderTitle = () => {
    if (isHomeScreen) return 'CaseWise';
    if (isCaseScreen) return 'Νέα Υπόθεση';
    if (isHistoryScreen) return 'Ιστορικό';
    if (isSettingsScreen) return 'Ρυθμίσεις';
    return 'CaseWise';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuToggle}>
          <Ionicons name="menu" size={24} color="#1a365d" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{getHeaderTitle()}</Text>
        </View>

        <TouchableOpacity onPress={handleSearchToggle}>
          <Ionicons name="search" size={24} color="#1a365d" />
        </TouchableOpacity>
      </View>

      <HeaderSearch
        isOpen={isSearchOpen}
        onClose={handleSearchToggle}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <HeaderMenu
        isOpen={isMenuOpen}
        onClose={handleMenuToggle}
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
        isHomeScreen={isHomeScreen}
        isCaseScreen={isCaseScreen}
        isHistoryScreen={isHistoryScreen}
        isSettingsScreen={isSettingsScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
  },
});

export default Header; 