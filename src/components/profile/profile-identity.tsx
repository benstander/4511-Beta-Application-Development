import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

// Avatar, name and bio
export function ProfileIdentity({ person, title }: { person: Person; title?: string }) {
  const theme = useTheme();

  return (
    <View style={styles.identity}>
      <Avatar person={person} size={96} />
      <View style={styles.nameBlock}>
        <Text style={[styles.name, { color: theme.text }]}>{title ?? person.name}</Text>
        <Text style={[styles.bio, { color: theme.textSecondary }]}>{person.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: 12,
  },
  nameBlock: {
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
  },
  bio: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
