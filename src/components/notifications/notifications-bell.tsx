import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';

import { Palette } from '@/constants/theme';
import { useHasUnreadNotifications } from '@/data/notifications';
import { useTheme } from '@/hooks/use-theme';

// Bell on the Sessions page, red dot when there's something new
export function NotificationsBell() {
  const theme = useTheme();
  const unread = useHasUnreadNotifications();

  return (
    <Pressable
      onPress={() => router.push('/notifications')}
      role="button"
      accessibilityLabel={unread ? 'Notifications, new' : 'Notifications'}
      hitSlop={12}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <BellIcon size={26} color={theme.text} />
      {unread && <View style={[styles.dot, { borderColor: theme.background }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: Palette.destructive,
  },
});
