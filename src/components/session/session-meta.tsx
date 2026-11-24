import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { FontFamily } from '@/constants/theme';
import { isCreator } from '@/data/session-store';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';
import { formatSessionTime } from '@/utils/format-session-time';

const AVATAR_COUNT = 3;

type SessionMetaProps = {
  session: Pick<
    Session,
    'startsAt' | 'endsAt' | 'location' | 'attendeeSummary' | 'attendees' | 'invited' | 'creator'
  >;
  variant?: 'card' | 'detail';
};

// Time and place on the left, avatars and who's going on the right
export function SessionMeta({ session, variant = 'card' }: SessionMetaProps) {
  const theme = useTheme();
  const { startsAt, endsAt, location, attendeeSummary, attendees, invited = [] } = session;
  const faces = (isCreator(session) ? [...attendees, ...invited] : attendees).slice(
    0,
    AVATAR_COUNT
  );
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
          {faces.map((person, i) => (
            <Avatar
              key={person.id}
              person={person}
              size={18}
              style={[
                styles.face,
                { borderColor: theme.background },
                i < faces.length - 1 && styles.avatarOverlap,
              ]}
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
  face: {
    borderWidth: 1.5,
  },
  avatarOverlap: {
    marginRight: -6,
  },
  summary: {
    lineHeight: 16,
  },
});
