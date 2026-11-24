import { StyleSheet, TextInput, View } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

import { fieldBoxStyle } from '@/components/ui/form-field';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function SearchField({
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
}: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View style={[fieldBoxStyle, styles.box, { borderColor: theme.text }]}>
      <MagnifyingGlassIcon size={18} color={theme.text} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.text}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
