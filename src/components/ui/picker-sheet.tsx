import { BottomSheet, DatePicker, Group, RNHostView, VStack } from '@expo/ui/swift-ui';
import {
  datePickerStyle,
  labelsHidden,
  padding,
  presentationDragIndicator,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FontFamily, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PickerSheetProps = {
  visible: boolean;
  title: string;
  mode: 'date' | 'time';
  initialValue: Date;
  onDone: (value: Date) => void;
  onClear: () => void;
  onClose: () => void;
};

// Native iOS sheet with a calendar or time wheel. Only saves when you press Done
export function PickerSheet({
  visible,
  title,
  mode,
  initialValue,
  onDone,
  onClear,
  onClose,
}: PickerSheetProps) {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue);

  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setValue(initialValue);
  }

  const isTime = mode === 'time';

  return (
    <BottomSheet
      isPresented={visible}
      // Swiping down closes it without saving
      onIsPresentedChange={(presented) => {
        if (!presented) onClose();
      }}
      fitToContents>
      <Group modifiers={[presentationDragIndicator('visible')]}>
        <VStack spacing={0}>
          <RNHostView matchContents={{ vertical: true }}>
            <View style={styles.header}>
              <Text role="heading" style={[styles.title, { color: theme.text }]}>
                {title}
              </Text>
              <Pressable
                onPress={onClose}
                role="button"
                accessibilityLabel={`Close ${title}`}
                hitSlop={10}>
                <Image
                  source={require('@/assets/icons/x-mark.svg')}
                  style={styles.close}
                  tintColor={theme.text}
                />
              </Pressable>
            </View>
          </RNHostView>

          <DatePicker
            selection={value}
            onDateChange={setValue}
            displayedComponents={isTime ? ['hourAndMinute'] : ['date']}
            modifiers={[
              datePickerStyle(isTime ? 'wheel' : 'graphical'),
              labelsHidden(),
              tint(Palette.primary),
              padding({ horizontal: 16 }),
            ]}
          />

          <RNHostView matchContents={{ vertical: true }}>
            <View style={styles.footer}>
              <Button label="Clear" variant="secondary" flex onPress={onClear} />
              <Button label="Done" flex onPress={() => onDone(value)} />
            </View>
          </RNHostView>
        </VStack>
      </Group>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
  },
  close: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
