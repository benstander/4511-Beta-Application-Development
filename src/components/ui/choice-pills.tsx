import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { FontFamily, ScreenPadding } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChoicePillsProps<T extends string> = {
  options: readonly T[];
  selected: T | null;
  onSelect: (value: T) => void;
  label: string;
};

// Row of pills where you pick one. Scrolls sideways if they don't fit
export function ChoicePills<T extends string>({
  options,
  selected,
  onSelect,
  label,
}: ChoicePillsProps<T>) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
      role="radiogroup"
      accessibilityLabel={label}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            role="radio"
            aria-checked={isSelected}
            style={({ pressed }) => [
              styles.pill,
              { borderColor: theme.text },
              isSelected && { backgroundColor: theme.text },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.text, { color: isSelected ? theme.background : theme.text }]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginHorizontal: -ScreenPadding,
  },
  row: {
    gap: 8,
    paddingHorizontal: ScreenPadding,
  },
  pill: {
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
