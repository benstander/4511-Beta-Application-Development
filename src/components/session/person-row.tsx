import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileSheet } from '@/components/profile/profile-sheet';
import { Avatar } from '@/components/ui/avatar';
import { FontFamily } from '@/constants/theme';
import { CURRENT_USER } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

// Icon on the right: going = tick, invited = clock, add = plus
export type PersonStatus = 'going' | 'invited' | 'add';

const STATUS_ICONS: Record<PersonStatus, number> = {
  going: require('@/assets/icons/check-circle.svg'),
  invited: require('@/assets/icons/clock-24.svg'),
  add: require('@/assets/icons/plus-circle.svg'),
};

const STATUS_LABELS: Record<PersonStatus, string> = {
  going: 'going',
  invited: 'invited',
  add: 'not invited',
};

type PersonRowProps = {
  person: Person;
  status?: PersonStatus;
  onPress?: () => void;
  actionLabel?: string;
};

// Tap the row to see their profile, tap the icon to invite or remove
export function PersonRow({ person, status = 'going', onPress, actionLabel }: PersonRowProps) {
  const theme = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const name = person.id === CURRENT_USER.id ? `${person.name} (you)` : person.name;

  const statusIcon = (
    <Image source={STATUS_ICONS[status]} style={styles.icon} tintColor={theme.text} />
  );

  return (
    <>
      <Pressable
        onPress={() => setProfileOpen(true)}
        role="button"
        accessibilityLabel={`${name}, ${STATUS_LABELS[status]}`}
        accessibilityHint="Opens their profile"
        style={({ pressed }) => [styles.row, { borderColor: theme.text }, pressed && styles.pressed]}>
        <View style={styles.identity}>
          <Avatar person={person} size={24} />
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {name}
          </Text>
        </View>
        {onPress ? (
          <Pressable
            onPress={onPress}
            role="button"
            accessibilityLabel={actionLabel ?? `${name}, ${STATUS_LABELS[status]}`}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}>
            {statusIcon}
          </Pressable>
        ) : (
          statusIcon
        )}
      </Pressable>

      <ProfileSheet person={person} visible={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}

type PersonListProps = {
  people: Person[];
  invited?: Person[];
};

export function PersonList({ people, invited = [] }: PersonListProps) {
  return (
    <View style={styles.list}>
      {people.map((person) => (
        <PersonRow key={person.id} person={person} />
      ))}
      {invited.map((person) => (
        <PersonRow key={person.id} person={person} status="invited" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 6,
  },
  row: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  name: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
