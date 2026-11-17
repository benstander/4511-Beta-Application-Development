import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LevelBadge } from '@/components/session/level-badge';
import { SessionImage } from '@/components/session/session-image';
import { SessionMeta } from '@/components/session/session-meta';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';

export type SessionCardProps = {
  session: Session;
  detailPathname?: '/session/[id]' | '/my-sessions/session/[id]';
};

// Session card, tap to open the session
export function SessionCard({ session, detailPathname = '/session/[id]' }: SessionCardProps) {
  const theme = useTheme();

  return (
    <Link href={{ pathname: detailPathname, params: { id: session.id } }} asChild>
      <Pressable
        role="link"
        accessibilityLabel={`${session.title}, view details`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <SessionImage image={session.image} style={styles.image} />

        <View style={[styles.body, { borderColor: theme.border }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {session.title}
            </Text>
            <LevelBadge level={session.level} />
          </View>
          <SessionMeta session={session} />
        </View>
      </Pressable>
    </Link>
  );
}

const RADIUS = 12;
const BORDER_WIDTH = 1.5;

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  body: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderLeftWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
});
