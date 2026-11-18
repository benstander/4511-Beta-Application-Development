import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

export function DetailSection({ title, children }: DetailSectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text role="heading" style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
});
