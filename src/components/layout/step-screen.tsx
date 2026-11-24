import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

import { BackButton } from '@/components/layout/back-button';
import { MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useTheme } from '@/hooks/use-theme';

type StepScreenProps = {
  title: string;
  showBack?: boolean;
  headerBack?: boolean;
  centerTitle?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

// Layout for each Create step
export function StepScreen({
  title,
  showBack,
  headerBack,
  centerTitle,
  children,
  footer,
}: StepScreenProps) {
  const theme = useTheme();
  const bottomTabInset = useBottomTabInset();
  const keyboardOpen = useKeyboardOpen();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}>
            {headerBack && (
              <View style={styles.backRow}>
                <BackButton />
              </View>
            )}
            <Text
              role="heading"
              style={[styles.title, centerTitle && styles.titleCentered, { color: theme.text }]}>
              {title}
            </Text>
            {children}
          </ScrollView>

          <View
            style={[
              styles.footer,
              // Keyboard covers the tab bar so we don't need the extra space
              { paddingBottom: (keyboardOpen ? 0 : bottomTabInset) + Spacing.three },
            ]}>
            {showBack ? (
              // Back button takes 1/4, the main button gets the rest
              <View style={styles.footerRow}>
                <Pressable
                  onPress={() => router.back()}
                  role="button"
                  accessibilityLabel="Go back"
                  style={({ pressed }) => [
                    styles.back,
                    {
                      backgroundColor: theme.buttonSecondary,
                      borderColor: theme.buttonSecondaryBorder,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <ArrowLeftIcon size={24} color={theme.text} strokeWidth={2} />
                </Pressable>
                <View style={styles.footerMain}>{footer}</View>
              </View>
            ) : (
              footer
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// true when the keyboard is open
function useKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return open;
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
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ScreenPadding,
    paddingTop: ScreenPadding,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  backRow: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
  },
  titleCentered: {
    textAlign: 'center',
  },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: ScreenPadding,
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  back: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  footerMain: {
    flex: 3,
  },
});
