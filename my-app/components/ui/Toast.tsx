import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  const showToast = (props: ToastProps) => {
    setToast(props);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    if (props.duration !== Infinity) {
      setTimeout(() => {
        hideToast();
      }, props.duration ?? 3000);
    }
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: -100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  };

  const contextValue = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
            toast.style,
          ]}
        >
          <View style={[styles.toast, toast.variant === 'destructive' && styles.destructiveToast]}>
            <Text style={[styles.message, toast.textStyle]}>{toast.message}</Text>
            <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={20}
                color={toast.variant === 'destructive' ? 'white' : '#1a365d'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  destructiveToast: {
    backgroundColor: '#dc2626',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#1a365d',
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
}); 