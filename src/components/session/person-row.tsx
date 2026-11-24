import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircleIcon, ClockIcon, PlusCircleIcon } from 'react-native-heroicons/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon as ClockSolidIcon,
  XCircleIcon as XCircleSolidIcon,
} from 'react-native-heroicons/solid';

import { ProfileSheet } from '@/components/profile/profile-sheet';
import { Avatar } from '@/components/ui/avatar';
import type { IconComponent } from '@/components/ui/button';
import { FontFamily, Palette } from '@/constants/theme';
import { useCurrentUser } from '@/data/profile-store';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

// Icon on the right: going = tick, invited = clock, declined = x, add = plus
export type PersonStatus = 'going' | 'invited' | 'declined' | 'add';

const STATUS_ICONS: Record<PersonStatus, IconComponent> = {
  going: CheckCircleIcon,
  invited: ClockIcon,
  declined: XCircleSolidIcon,
  add: PlusCircleIcon,
};

const STATUS_LABELS: Record<PersonStatus, string> = {
  going: 'going',
  invited: 'invited',
  declined: 'declined',
  add: 'not invited',
};

const TINTED_ICONS: Partial<Record<PersonStatus, { icon: IconComponent; color: string }>> = {
  going: { icon: CheckCircleSolidIcon, color: Palette.success },
  invited: { icon: ClockSolidIcon, color: Palette.pending },
  declined: { icon: XCircleSolidIcon, color: Palette.destructive },
};

type PersonRowProps = {
  person: Person;
  status?: PersonStatus | null;
  onPress?: () => void;
  actionLabel?: string;
  tinted?: boolean;
};

// Tap the row to see their profile, tap the icon to invite or remove
export function PersonRow({
  person: listed,
  status = 'going',
  onPress,
  actionLabel,
  tinted,
}: PersonRowProps) {
  const theme = useTheme();
  const me = useCurrentUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const isYou = listed.id === me.id;
  const person = isYou ? me : listed;
  const name = isYou ? `${person.name} (you)` : person.name;

  const label = status ? `${name}, ${STATUS_LABELS[status]}` : name;
  const tint = tinted && status ? TINTED_ICONS[status] : undefined;
  const StatusIcon = status ? (tint?.icon ?? STATUS_ICONS[status]) : null;
  const statusIcon = StatusIcon && <StatusIcon size={24} color={tint?.color ?? theme.text} />;

  return (
    <>
      <Pressable
        onPress={() => setProfileOpen(true)}
        role="button"
        accessibilityLabel={label}
        accessibilityHint="Opens their profile"
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}>
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
            accessibilityLabel={actionLabel ?? label}
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
  declined?: Person[];
};

// Going first, then invited, then declined
export function PersonList({ people, invited = [], declined = [] }: PersonListProps) {
  return (
    <View style={styles.list}>
      {people.map((person) => (
        <PersonRow key={person.id} person={person} tinted />
      ))}
      {invited.map((person) => (
        <PersonRow key={person.id} person={person} status="invited" tinted />
      ))}
      {declined.map((person) => (
        <PersonRow key={person.id} person={person} status="declined" tinted />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 6,
  },
  row: {
    height: 60,
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
  name: {
    flexShrink: 1,
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
