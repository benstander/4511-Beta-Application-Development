import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StepScreen } from '@/components/layout/step-screen';
import { PersonRow } from '@/components/session/person-row';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { SearchField } from '@/components/ui/search-field';
import { FontFamily } from '@/constants/theme';
import { toggleInvite, useCreateDraft } from '@/data/create-draft';
import { FRIENDS, findFriend } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';

const SHORT_LIST = 3;

// Step 5: invite friends. Tap to invite, tap again to remove
export default function CreateInviteScreen() {
  const draft = useCreateDraft();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const q = query.trim().toLowerCase();
  const friends = q
    ? FRIENDS.filter((person) => person.name.toLowerCase().includes(q))
    : showAll
      ? FRIENDS
      : FRIENDS.slice(0, SHORT_LIST);
  const invited = draft.invitedIds.flatMap((id) => findFriend(id) ?? []);

  return (
    <StepScreen
      title="Invite friends"
      showBack
      footer={<Button label="Confirm session" onPress={() => router.push('/create/summary')} />}>
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
              onPress={() => toggleInvite(person.id)}
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
        {q === '' && FRIENDS.length > SHORT_LIST && (
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
                onPress={() => toggleInvite(person.id)}
                actionLabel={`${person.name}, invited. Tap to uninvite`}
              />
            ))}
          </View>
        </FormField>
      )}
    </StepScreen>
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
