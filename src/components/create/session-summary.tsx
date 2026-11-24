import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PersonList } from '@/components/session/person-row';
import { SessionMap } from '@/components/session/session-map';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { SPORT_EMOJIS } from '@/data/sessions';
import { FontFamily, Palette, SessionLevelColors, type SessionLevel } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Coordinates, Person, SessionType, Sport } from '@/types/session';

const LEVEL_LABELS: Record<SessionLevel, string> = {
  social: 'Social',
  competitive: 'Competitive',
  beginner: 'Beginner',
};

type SessionSummaryProps = {
  title: string;
  image?: ImageSource | number;
  sport: Sport;
  type: SessionType;
  level: SessionLevel;
  invited: Person[];
  startsAt: Date;
  endsAt: Date;
  location: string;
  coordinates?: Coordinates;
  celebrate?: boolean;
};

// Summary card for a new session: photo, name, type, level, who's invited, when and where
export function SessionSummary({
  title,
  image,
  sport,
  type,
  level,
  invited,
  startsAt,
  endsAt,
  location,
  coordinates,
  celebrate,
}: SessionSummaryProps) {
  const theme = useTheme();
  const [showInvited, setShowInvited] = useState(false);
  const border = { borderColor: theme.text };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.art}>
          {celebrate && (
            <Image
              source={require('@/assets/images/confetti.png')}
              style={styles.confetti}
              contentFit="cover"
              accessible={false}
            />
          )}
          {image ? (
            <Image source={image} style={styles.photo} contentFit="cover" accessible={false} />
          ) : (
            <View style={styles.photo}>
              <Text style={styles.emoji}>{SPORT_EMOJIS[sport]}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <View style={styles.pills}>
          <View style={[styles.pill, styles.pillOutline, border]}>
            <Text style={[styles.pillText, { color: theme.text }]}>{type}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: SessionLevelColors[level] }]}>
            <Text style={[styles.pillText, { color: Palette.onColor }]}>{LEVEL_LABELS[level]}</Text>
          </View>
        </View>
      </View>

      <View>
        <View style={[styles.row, styles.rowFirst, border]}>
          <Text style={[styles.rowText, { color: theme.text }]}>{sport}</Text>
        </View>
        <View style={[styles.row, border]}>
          <Text style={[styles.rowText, { color: theme.text }]}>{formatShortDate(startsAt)}</Text>
          <Text style={[styles.rowText, { color: theme.text }]}>
            {formatClock(startsAt)} - {formatClock(endsAt)}
          </Text>
        </View>
        <View style={[styles.row, border]}>
          <Text style={[styles.rowText, styles.rowTextShrink, { color: theme.text }]} numberOfLines={1}>
            {type === 'Solo' ? 'Just you' : invitedText(invited)}
          </Text>
          {invited.length > 0 && (
            <Pressable
              onPress={() => setShowInvited(true)}
              role="button"
              accessibilityLabel="View everyone invited"
              hitSlop={10}>
              <Text style={[styles.rowText, { color: theme.text }]}>View all</Text>
            </Pressable>
          )}
        </View>
        <View style={[styles.row, !coordinates && styles.rowLast, border]}>
          <Text style={[styles.rowText, styles.rowTextShrink, { color: theme.text }]}>{location}</Text>
        </View>
        {coordinates && <SessionMap coordinates={coordinates} label={location} attached />}
      </View>

      <BottomSheet
        visible={showInvited}
        onClose={() => setShowInvited(false)}
        header={
          <View style={styles.sheetHeader}>
            <View style={[styles.grabber, { backgroundColor: theme.buttonSecondaryBorder }]} />
            <Text role="heading" style={[styles.sheetTitle, { color: theme.text }]}>
              Invited friends
            </Text>
          </View>
        }>
        <View style={styles.sheetBody}>
          <PersonList people={[]} invited={invited} />
        </View>
      </BottomSheet>
    </View>
  );
}

// e.g. "Alex and John are invited"
function invitedText(invited: Person[]) {
  const names = invited.map((person) => person.name);
  if (names.length === 0) return 'No one invited yet';
  if (names.length === 1) return `${names[0]} is invited`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are invited`;
  return `${names[0]}, ${names[1]} + ${names.length - 2} are invited`;
}

// e.g. 5/11/2026
function formatShortDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// e.g. 11:00am
export function formatClock(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes}${hours < 12 ? 'am' : 'pm'}`;
}

const RADIUS = 12;
const BORDER = 1.5;

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  hero: {
    alignItems: 'center',
    gap: 20,
  },
  art: {
    alignItems: 'center',
  },
  confetti: {
    width: 250,
    height: 125,
    marginBottom: -72,
  },
  photo: {
    width: 134,
    height: 134,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 88,
  },
  title: {
    marginTop: -16,
    fontFamily: FontFamily.semiBold,
    fontSize: 32,
    textAlign: 'center',
  },
  pills: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOutline: {
    borderWidth: BORDER,
  },
  pillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderLeftWidth: BORDER,
    borderRightWidth: BORDER,
    borderBottomWidth: BORDER,
  },
  rowFirst: {
    borderTopWidth: BORDER,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  rowLast: {
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  rowText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  rowTextShrink: {
    flexShrink: 1,
  },
  sheetHeader: {
    paddingTop: 12,
    paddingHorizontal: 24,
    gap: 20,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  sheetTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
    textAlign: 'center',
  },
  sheetBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
});
