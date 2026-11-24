import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

import { FontFamily, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CategoryTabsProps<T extends string> = {
  categories: readonly T[];
  selected: T;
  onSelect: (category: T) => void;
  onFilterPress?: () => void;
  filterCount?: number;
};

export function CategoryTabs<T extends string>({
  categories,
  selected,
  onSelect,
  onFilterPress,
  filterCount = 0,
}: CategoryTabsProps<T>) {
  const theme = useTheme();
  const filterActive = filterCount > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.tabs}
        role="tablist">
        {categories.map((category) => {
          const isSelected = category === selected;
          return (
            <Pressable
              key={category}
              onPress={() => onSelect(category)}
              role="tab"
              aria-selected={isSelected}
              hitSlop={{ left: 8, right: 8 }}
              style={({ pressed }) => [
                styles.tab,
                isSelected && [styles.tabSelected, { borderColor: theme.text }],
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.label, { color: theme.text }]}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={onFilterPress}
        disabled={!onFilterPress}
        role="button"
        accessibilityLabel={
          filterActive
            ? `Filters, ${filterCount} applied`
            : 'Filters'
        }
        hitSlop={6}
        style={({ pressed }) => [
          styles.filterButton,
          // Blue outline when filters are on
          { borderColor: filterActive ? Palette.primary : 'transparent' },
          pressed && styles.pressed,
        ]}>
        <AdjustmentsHorizontalIcon size={26} color={theme.text} />
        {filterActive && (
          <View
            style={[
              styles.countBadge,
              { backgroundColor: Palette.primary },
            ]}>
            <Text style={styles.countText}>{filterCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 12,
  },
  tabSelected: {
    borderBottomWidth: 2.5,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
  filterButton: {
    padding: 6,
    borderRadius: 999,
    borderWidth: 2,
  },
  countBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    lineHeight: 12,
    color: Palette.onColor,
  },
});
