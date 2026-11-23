import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PersonRow } from '@/components/session/person-row';
import { FormField } from '@/components/ui/form-field';
import { SearchField } from '@/components/ui/search-field';
import { FontFamily } from '@/constants/theme';
import type { DraftFieldsProps } from '@/data/create-draft';
import { useFriends } from '@/data/friends-store';
import { findPerson } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';

const SHORT_LIST = 3;

// Search and list of friends to invite
export function FriendInvites({ draft, onChange }: DraftFieldsProps) {
  const theme = useTheme();
  const allFriends = useFriends();
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const q = query.trim().toLowerCase();
  const friends = q
    ? allFriends.filter((person) => person.name.toLowerCase().includes(q))
    : showAll
      ? allFriends
      : allFriends.slice(0, SHORT_LIST);
  const invited = draft.invitedIds
    .map((id) => findPerson(id))
    .filter((person) => person !== undefined);

  const toggle = (id: string) =>
    onChange({
      invitedIds: draft.invitedIds.includes(id)
        ? draft.invitedIds.filter((invitedId) => invitedId !== id)
        : [...draft.invitedIds, id],
    });

  return (
    <>
      <FormField label="Search">
        <SearchField value={query} onChangeText={setQuery} placeholder="Find someone...." />
      </FormField>

      <FormField label="Friends">
        {friends.map((person) => {
          const isInvited = draft.invitedIds.includes(person.id);
          return (
            <PersonRow
              key={person.id}
              person={person}
              status={isInvited ? 'going' : 'add'}
              onPress={() => toggle(person.id)}
              actionLabel={isInvited ? `${person.name}, invited. Tap to uninvite` : `Invite ${person.name}`}
            />
          );
        })}
        {q !== '' && friends.length === 0 && (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No friends match &quot;{query.trim()}&quot;.
          </Text>
        )}
        {/* Only show View all when not searching and there are more friends */}
        {q === '' && allFriends.length > SHORT_LIST && (
          <Pressable
            onPress={() => setShowAll((all) => !all)}
            role="button"
            style={({ pressed }) => [
              styles.viewAll,
              { backgroundColor: theme.text },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.viewAllText, { color: theme.background }]}>
              {showAll ? 'Show less' : 'View all'}
            </Text>
          </Pressable>
        )}
      </FormField>

      {invited.length > 0 && (
        <FormField label="Invited friends">
          <View style={styles.list}>
            {invited.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                status="going"
                onPress={() => toggle(person.id)}
                actionLabel={`${person.name}, invited. Tap to uninvite`}
              />
            ))}
          </View>
        </FormField>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 6,
  },
  viewAll: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  empty: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    paddingVertical: 8,
  },
});
