import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = {
  label: string;
  labelAccessory?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Label above a form input
export function FormField({ label, labelAccessory, children, style }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {labelAccessory}
      </View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
});
