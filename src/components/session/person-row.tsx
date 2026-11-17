import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { CURRENT_USER } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

type PersonRowProps = {
  person: Person;
};

// Row with avatar, name and a tick
export function PersonRow({ person }: PersonRowProps) {
  const theme = useTheme();
  const name = person.id === CURRENT_USER.id ? `${person.name} (you)` : person.name;

  return (
    <View style={[styles.row, { borderColor: theme.text }]}>
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
      <Image
        source={require('@/assets/icons/check-circle.svg')}
        style={styles.icon}
        tintColor={theme.text}
      />
    </View>
  );
}

type PersonListProps = {
  people: Person[];
};

// List of PersonRows
export function PersonList({ people }: PersonListProps) {
  return (
    <View style={styles.list}>
      {people.map((person) => (
        <PersonRow key={person.id} person={person} />
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
