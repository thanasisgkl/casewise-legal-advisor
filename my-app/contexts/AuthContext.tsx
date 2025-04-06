import React, { createContext, useContext, useState, useMemo } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication
      // 1. Add API endpoint for authentication
      // 2. Add form validation
      // 3. Add error handling for invalid credentials
      // 4. Add loading state during authentication
      // 5. Add token storage and management
      // 6. Add session persistence
      setUser({
        id: '1',
        email,
        name: 'Test User',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // TODO: Implement actual sign out
      // 1. Add API endpoint for sign out
      // 2. Clear stored tokens
      // 3. Clear session data
      // 4. Add loading state during sign out
      // 5. Handle failed sign out attempts
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 