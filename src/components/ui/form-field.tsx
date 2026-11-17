import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = {
  label: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Label above a form input
export function FormField({ label, children, style }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      {children}
    </View>
  );
}

export const fieldBoxStyle: ViewStyle = {
  height: 52,
  borderWidth: 1.5,
  borderRadius: 12,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
});
