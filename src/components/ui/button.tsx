import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'destructiveText';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: 'large' | 'medium';
  icon?: ImageSource | number;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  onPress?: () => void;
  flex?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'trailing',
  disabled,
  onPress,
  flex,
}: ButtonProps) {
  const theme = useTheme();

  const container = {
    primary: { backgroundColor: disabled ? theme.buttonDisabled : Palette.primary },
    secondary: {
      backgroundColor: theme.buttonSecondary,
      borderColor: theme.buttonSecondaryBorder,
      borderWidth: 1.5,
    },
    outline: { borderColor: theme.text, borderWidth: 1.5 },
    destructive: { backgroundColor: Palette.destructive },
    destructiveText: { height: 44 },
  }[variant];

  const textColor = {
    primary: disabled ? theme.textDisabled : Palette.onColor,
    secondary: theme.text,
    outline: theme.text,
    destructive: Palette.onColor,
    destructiveText: Palette.destructive,
  }[variant];

  const iconImage =
    icon != null ? <Image source={icon} style={styles.icon} tintColor={textColor} /> : null;

  const content = (
    <>
      {iconPosition === 'leading' && iconImage}
      <Text
        style={[
          styles.label,
          size === 'large' ? styles.labelLarge : styles.labelMedium,
          variant === 'secondary' && size === 'medium' && styles.labelRegularWeight,
          { color: textColor },
        ]}>
        {label}
      </Text>
      {iconPosition === 'trailing' && iconImage}
    </>
  );

  const baseStyle = [styles.button, container, flex && styles.flex];

  if (!onPress) {
    return (
      <View style={baseStyle} accessibilityLabel={label}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      aria-disabled={disabled}
      role="button"
      style={({ pressed }) => [baseStyle, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },
  labelRegularWeight: {
    fontFamily: FontFamily.medium,
  },
  labelLarge: {
    fontSize: 18,
  },
  labelMedium: {
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
