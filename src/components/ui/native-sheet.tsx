import { BottomSheet, Group, Host, RNHostView, ZStack } from '@expo/ui/swift-ui';
import { presentationDetents, presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';
import type { ReactNode } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NativeSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  overlay?: ReactNode;
};

// Native iOS sheet. Sheets passed in as overlay show on top of it
export function NativeSheet({ visible, onClose, children, overlay }: NativeSheetProps) {
  const theme = useTheme();
  const scheme = useColorScheme();

  return (
    // Only used to show the sheet, takes up no space
    <Host
      style={styles.host}
      colorScheme={scheme === 'dark' ? 'dark' : 'light'}
      seedColor={Palette.primary}>
      <BottomSheet
        isPresented={visible}
        onIsPresentedChange={(presented) => {
          if (!presented) onClose();
        }}>
        <Group modifiers={[presentationDetents(['large']), presentationDragIndicator('visible')]}>
          <ZStack>
            <RNHostView>
              <View style={[styles.body, { backgroundColor: theme.surface }]}>{children}</View>
            </RNHostView>
            {overlay}
          </ZStack>
        </Group>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  body: {
    flex: 1,
    paddingBottom: 16,
  },
});
