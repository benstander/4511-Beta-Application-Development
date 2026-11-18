import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const theme = useTheme();

  const handlePress =
    onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <Pressable
      onPress={handlePress}
      role="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.iconButton, borderColor: theme.iconButtonBorder },
        pressed && styles.pressed,
      ]}>
      <Image
        source={require('@/assets/icons/arrow-left.svg')}
        style={styles.icon}
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
