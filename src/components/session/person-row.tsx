import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

export function PersonRow({ person, status = 'going', onPress, actionLabel }: PersonRowProps) {
  const theme = useTheme();
  const name = person.id === CURRENT_USER.id ? `${person.name} (you)` : person.name;

  const content = (
    <>
      <View style={styles.identity}>
        <Image
          source={require('@/assets/icons/user-circle-24.svg')}
          style={styles.icon}
          tintColor={theme.text}
        />
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <Image source={STATUS_ICONS[status]} style={styles.icon} tintColor={theme.text} />
    </>
  );

  // Tappable rows are buttons, the rest are read as one item by screen readers
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        role="button"
        accessibilityLabel={actionLabel ?? `${name}, ${STATUS_LABELS[status]}`}
        style={({ pressed }) => [
          styles.row,
          { borderColor: theme.text },
          pressed && styles.pressed,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.row, { borderColor: theme.text }]}
      accessible
      accessibilityLabel={`${name}, ${STATUS_LABELS[status]}`}>
      {content}
    </View>
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
