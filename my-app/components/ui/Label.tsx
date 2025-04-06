import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

interface LabelProps extends TextProps {
  style?: TextStyle;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ style, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.label, style]}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a365d',
    marginBottom: 4,
  },
});

export { Label }; 