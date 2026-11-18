import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useTheme } from '@/hooks/use-theme';

type PageProps = {
  title: string;
  children?: ReactNode;
};

export function Page({ title, children }: PageProps) {
  const theme = useTheme();
  const bottomTabInset = useBottomTabInset();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { paddingBottom: bottomTabInset + Spacing.three }]}>
        <Text role="heading" style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        {children}
      </SafeAreaView>
    </View>
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
    gap: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
  },
});
