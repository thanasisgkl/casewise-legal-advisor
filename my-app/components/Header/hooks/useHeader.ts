import { useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export const useHeader = () => {
  const router = useRouter();
  const segments = useSegments() as string[];
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHomeScreen = segments.length === 0;
  const isCaseScreen = segments[0] === 'case';
  const isHistoryScreen = segments[0] === 'history';
  const isSettingsScreen = segments[0] === 'settings';

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    // 1. Add search API endpoint
    // 2. Add search state management
    // 3. Add search results display
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigate = (route: string) => {
    router.push(route);
    setIsMenuOpen(false);
  };

  return {
    user,
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
  };
}; 