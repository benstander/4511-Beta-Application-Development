import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
};

// Popup to confirm something, with Cancel and confirm buttons
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const theme = useTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      role="alertdialog"
      header={
        <View style={styles.content}>
          <View style={[styles.grabber, { backgroundColor: theme.buttonSecondaryBorder }]} />
          <View style={styles.copy}>
            <Text role="heading" style={[styles.title, { color: theme.text }]}>
              {title}
            </Text>
            <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
          </View>
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" size="medium" flex onPress={onCancel} />
            <Button
              label={confirmLabel}
              variant={tone === 'destructive' ? 'destructive' : 'primary'}
              size="medium"
              flex
              onPress={onConfirm}
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 24,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  copy: {
    gap: 16,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
