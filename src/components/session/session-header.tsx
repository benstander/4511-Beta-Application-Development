import { StyleSheet, Text, View } from 'react-native';

import { LevelBadge } from '@/components/session/level-badge';
import { SessionImage } from '@/components/session/session-image';
import { SessionMeta } from '@/components/session/session-meta';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';

type SessionHeaderProps = {
  session: Session;
};

export function SessionHeader({ session }: SessionHeaderProps) {
  const theme = useTheme();

  return (
    <View>
      <SessionImage image={session.image} sport={session.sport} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text role="heading" style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {session.title}
          </Text>
          <LevelBadge level={session.level} size="large" />
        </View>
        <SessionMeta session={session} variant="detail" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
  body: {
    gap: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
    fontSize: 22,
  },
});
