import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StepScreen } from '@/components/layout/step-screen';
import { PersonRow } from '@/components/session/person-row';
import { FormField } from '@/components/ui/form-field';
import { SearchField } from '@/components/ui/search-field';
import { FontFamily } from '@/constants/theme';
import { addFriend, isFriend, useFriends } from '@/data/friends-store';
import { USERS } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

const SUGGESTIONS = 3;

// Your friends and a search to add more people. Tap someone to see their profile
export default function FriendsScreen() {
  const theme = useTheme();
  const friends = useFriends();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = USERS.filter((person) => person.name.toLowerCase().includes(q));
  const suggestions = USERS.filter((person) => !isFriend(friends, person.id)).slice(0, SUGGESTIONS);

  const row = (person: Person) =>
    isFriend(friends, person.id) ? (
      <PersonRow key={person.id} person={person} status={null} />
    ) : (
      <PersonRow
        key={person.id}
        person={person}
        status="add"
        onPress={() => addFriend(person.id)}
        actionLabel={`Add ${person.name}`}
      />
    );

  return (
    <StepScreen
      title="Friends"
      headerBack>
      <FormField label="Search">
        <SearchField value={query} onChangeText={setQuery} placeholder="Find someone...." />
      </FormField>

      {q ? (
        <FormField label="Results">
          <View style={styles.list}>{results.map(row)}</View>
          {results.length === 0 && (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              No one matches &quot;{query.trim()}&quot;.
            </Text>
          )}
        </FormField>
      ) : (
        <>
          <FormField label="Your friends">
            <View style={styles.list}>{friends.map(row)}</View>
            {friends.length === 0 && (
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                No friends yet. Search to add some.
              </Text>
            )}
          </FormField>
          {suggestions.length > 0 && (
            <FormField label="People you may know">
              <View style={styles.list}>{suggestions.map(row)}</View>
            </FormField>
          )}
        </>
      )}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 6,
  },
  empty: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    paddingVertical: 8,
  },
});
