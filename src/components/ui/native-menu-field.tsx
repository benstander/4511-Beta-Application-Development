import { HStack, Host, Image, Menu, Picker, Spacer, Text } from '@expo/ui/swift-ui';
import {
  background,
  buttonStyle,
  contentShape,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  menuIndicator,
  menuStyle,
  padding,
  pickerStyle,
  shapes,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { fieldBoxStyle } from '@/components/ui/form-field';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type MenuOption<T> = { label: string; value: T };

type NativeMenuFieldProps<T> = {
  placeholder: string;
  options: MenuOption<T>[];
  selected: T | null;
  onChange: (value: T) => void;
  badgeColor?: (value: T) => string;
};

// Field that opens a native iOS menu to pick an option (iOS only)
export function NativeMenuField<T>({
  placeholder,
  options,
  selected,
  onChange,
  badgeColor,
}: NativeMenuFieldProps<T>) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const display = selectedIndex === -1 ? placeholder : options[selectedIndex].label;
  const pillColor = selectedIndex === -1 ? undefined : badgeColor?.(options[selectedIndex].value);

  const label = (
    <HStack
      spacing={8}
      modifiers={[
        padding({ leading: pillColor ? 12 : 16, trailing: 16 }),
        frame({ maxWidth: 10000, maxHeight: 10000 }),
        contentShape(shapes.rectangle()),
      ]}>
      {pillColor ? (
        // Looks the same as LevelBadge
        <Text
          modifiers={[
            font({ family: 'Instrument Sans', size: 15, weight: 'semibold' }),
            foregroundStyle(Palette.onColor),
            lineLimit(1),
            padding({ horizontal: 12 }),
            frame({ height: 32 }),
            background(pillColor, shapes.capsule()),
          ]}>
          {display}
        </Text>
      ) : (
        <Text
          modifiers={[
            font({ family: 'Instrument Sans', size: 16, weight: 'medium' }),
            foregroundStyle(theme.text),
            lineLimit(1),
          ]}>
          {display}
        </Text>
      )}
      <Spacer />
      <Image systemName="chevron.down" size={14} color={theme.text} />
    </HStack>
  );

  return (
    <View style={[styles.box, { borderColor: theme.text }]}>
      <Host
        style={styles.host}
        alignment="leading"
        // Stops SwiftUI moving the text around
        ignoreSafeArea="all"
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        seedColor={Palette.primary}>
        <Menu
          label={label}
          modifiers={[
            frame({ maxWidth: 10000, maxHeight: 10000 }),
            menuStyle('button'),
            buttonStyle('plain'),
            menuIndicator('hidden'),
          ]}>
          <Picker
            selection={selectedIndex}
            onSelectionChange={(index: number) => onChange(options[index].value)}
            modifiers={[pickerStyle('inline')]}>
            {options.map((option, index) => (
              <Text key={option.label} modifiers={[tag(index)]}>
                {option.label}
              </Text>
            ))}
          </Picker>
        </Menu>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    ...fieldBoxStyle,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  host: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
