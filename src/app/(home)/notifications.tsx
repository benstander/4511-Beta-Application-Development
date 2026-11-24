import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StepScreen } from '@/components/layout/step-screen';
import { Avatar } from '@/components/ui/avatar';
import { FontFamily, Palette } from '@/constants/theme';
import {
  markNotificationsSeen,
  useNotifications,
  useNotificationsSeenAt,
  type AppNotification,
} from '@/data/notifications';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeTime } from '@/utils/format-relative-time';

// List of invites, replies and reminders. Tapping one opens the session
export default function NotificationsScreen() {
  const theme = useTheme();
  const notifications = useNotifications();
  const seenAt = useNotificationsSeenAt();
  const [newSince] = useState(seenAt);

  useEffect(() => {
    markNotificationsSeen();
  }, []);

  return (
    <StepScreen title="Notifications" headerBack>
      <View style={styles.list}>
        {notifications.map((item) => (
          <NotificationRow key={item.id} item={item} unread={item.at.getTime() > newSince} />
        ))}
      </View>
      {notifications.length === 0 && (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>No notifications yet.</Text>
      )}
    </StepScreen>
  );
}

function NotificationRow({ item, unread }: { item: AppNotification; unread: boolean }) {
  const theme = useTheme();
  const bold = (text: string) => <Text style={styles.bold}>{text}</Text>;
  const name = item.person ? bold(item.person.name) : null;
  const title = bold(item.session.title);

  const message = {
    invite: (
      <>
        {name} invited you to {title}
      </>
    ),
    going: (
      <>
        {name} is going to {title}
      </>
    ),
    declined: (
      <>
        {name} can&apos;t make {title}
      </>
    ),
    reminder: <>{title} starts in 1 hour</>,
  }[item.kind];

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/session/[id]',
          params: { id: item.session.id },
        })
      }
      role="button"
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      {item.person ? (
        <Avatar person={item.person} size={36} />
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: theme.background }]}>
          <Image
            source={require('@/assets/icons/clock.svg')}
            style={styles.icon}
            tintColor={theme.text}
          />
        </View>
      )}
      <View style={styles.body}>
        <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {formatRelativeTime(item.at)}
        </Text>
      </View>
      {unread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 6,
  },
  row: {
    minHeight: 60,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  bold: {
    fontFamily: FontFamily.bold,
  },
  time: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },
  empty: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    paddingVertical: 8,
  },
});
