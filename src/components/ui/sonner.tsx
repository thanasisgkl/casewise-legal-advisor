import Toast from 'react-native-toast-message';

type ToasterProps = {
  type?: 'success' | 'error' | 'info';
  text1?: string;
  text2?: string;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
};

const Toaster = () => {
  return null; // Το Toast εμφανίζεται μέσω της Toast.show()
};

export { Toaster };
