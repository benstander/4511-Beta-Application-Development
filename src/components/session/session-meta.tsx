import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';
import { formatSessionTime } from '@/utils/format-session-time';

const AVATAR_COUNT = 3;

type SessionMetaProps = {
  session: Pick<Session, 'startsAt' | 'endsAt' | 'location' | 'attendeeSummary'>;
  variant?: 'card' | 'detail';
};

// Time and place on the left, avatars and who's going on the right
export function SessionMeta({ session, variant = 'card' }: SessionMetaProps) {
  const theme = useTheme();
  const { startsAt, endsAt, location, attendeeSummary } = session;
  const wrap = variant === 'detail';
  const lines = wrap ? undefined : 1;

  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <View style={[styles.detail, wrap && styles.detailWrapped]}>
          <Image
            source={require('@/assets/icons/clock.svg')}
            style={[styles.icon, wrap && styles.iconWrapped]}
            tintColor={theme.text}
          />
          <Text style={[styles.text, { color: theme.text }]} numberOfLines={lines}>
            {formatSessionTime(startsAt, endsAt)}
          </Text>
        </View>
        <View style={[styles.detail, wrap && styles.detailWrapped]}>
          <Image
            source={require('@/assets/icons/map-pin.svg')}
            style={[styles.icon, wrap && styles.iconWrapped]}
            tintColor={theme.text}
          />
          <Text style={[styles.text, { color: theme.text }]} numberOfLines={lines}>
            {location}
          </Text>
        </View>
      </View>

      <View style={styles.attendees}>
        <View style={styles.avatars}>
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <Image
              key={i}
              source={require('@/assets/icons/user-circle.svg')}
              style={[styles.icon, i < AVATAR_COUNT - 1 && styles.avatarOverlap]}
              tintColor={theme.text}
            />
          ))}
        </View>
        <Text style={[styles.text, styles.summary, { color: theme.text }]} numberOfLines={1}>
          {attendeeSummary}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  details: {
    flexShrink: 1,
    maxWidth: '70%',
    gap: 6,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailWrapped: {
    alignItems: 'flex-start',
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconWrapped: {
    marginTop: 1,
  },
  text: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  attendees: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 6,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatarOverlap: {
    marginRight: -6,
  },
  summary: {
    lineHeight: 16,
  },
});
