import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';

type PageProps = {
  title: string;
  children?: ReactNode;
};

// Tab page with the title at the top
export function Page({ title, children }: PageProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ThemedText type="pageTitle" accessibilityRole="header">
          {title}
        </ThemedText>
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: ScreenPadding,
    paddingTop: ScreenPadding,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
});
