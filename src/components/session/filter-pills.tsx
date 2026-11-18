import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { FontFamily } from '@/constants/theme';
import {
  activeFilterPills,
  removeFilter,
  type SessionFilters,
} from '@/data/session-filters';
import { useTheme } from '@/hooks/use-theme';

type FilterPillsProps = {
  filters: SessionFilters;
  onChange: (filters: SessionFilters) => void;
};

export function FilterPills({ filters, onChange }: FilterPillsProps) {
  const theme = useTheme();
  const pills = activeFilterPills(filters);

  // Hide if no filters are on
  if (pills.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}>
      {pills.map((pill) => (
        <Pressable
          key={pill.key}
          onPress={() => onChange(removeFilter(filters, pill.key))}
          role="button"
          accessibilityLabel={`Remove filter ${pill.label}`}
          style={({ pressed }) => [
            styles.pill,
            { backgroundColor: theme.iconButton },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
            {pill.label}
          </Text>
          <Image
            source={require('@/assets/icons/x-mark.svg')}
            style={styles.remove}
            tintColor={theme.text}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    height: 32,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    maxWidth: 180,
  },
  remove: {
    width: 14,
    height: 14,
  },
});
