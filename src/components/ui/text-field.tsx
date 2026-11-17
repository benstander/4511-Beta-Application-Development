import { StyleSheet, TextInput } from 'react-native';

import { fieldBoxStyle } from '@/components/ui/form-field';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  accessibilityLabel?: string;
  maxLength?: number;
};

// Text input that matches the other form fields
export function TextField({
  value,
  onChangeText,
  placeholder,
  multiline,
  accessibilityLabel,
  maxLength,
}: TextFieldProps) {
  const theme = useTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      accessibilityLabel={accessibilityLabel ?? placeholder}
      multiline={multiline}
      maxLength={maxLength}
      textAlignVertical={multiline ? 'top' : 'center'}
      returnKeyType={multiline ? 'default' : 'done'}
      style={[
        fieldBoxStyle,
        styles.input,
        multiline && styles.multiline,
        { borderColor: theme.text, color: theme.text },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  multiline: {
    height: 282,
    paddingTop: 16,
    paddingBottom: 16,
    lineHeight: 22,
    alignItems: 'flex-start',
  },
});
