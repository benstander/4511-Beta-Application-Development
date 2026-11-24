import { Pressable, StyleSheet, Text } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';

import { fieldBoxStyle } from '@/components/ui/form-field';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FieldTriggerProps = {
  text: string;
  open: boolean;
  onPress: () => void;
};

// Field with an arrow that opens a picker
export function FieldTrigger({ text, open, onPress }: FieldTriggerProps) {
  const theme = useTheme();

  return (
    <Pressable
      role="button"
      aria-expanded={open}
      accessibilityLabel={text}
      onPress={onPress}
      style={[fieldBoxStyle, styles.box, { borderColor: theme.text }]}>
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={1}>
        {text}
      </Text>
      <ChevronDownIcon size={18} color={theme.text} style={open && styles.chevronOpen} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    justifyContent: 'space-between',
    gap: 8,
  },
  text: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
});
