import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CategoryTabsProps<T extends string> = {
  categories: readonly T[];
  selected: T;
  onSelect: (category: T) => void;
  onFilterPress?: () => void;
};

// Category tabs with the filter button on the right
export function CategoryTabs<T extends string>({
  categories,
  selected,
  onSelect,
  onFilterPress,
}: CategoryTabsProps<T>) {
  const theme = useTheme();

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
        accessibilityLabel="Filters"
        hitSlop={6}
        style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
        <Image
          source={require('@/assets/icons/adjustments-horizontal.svg')}
          style={styles.filterIcon}
          tintColor={theme.text}
        />
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
    padding: 8,
  },
  filterIcon: {
    width: 26,
    height: 26,
  },
});
