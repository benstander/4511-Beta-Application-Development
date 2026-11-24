import { router, useLocalSearchParams, useSegments } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckBadgeIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/layout/back-button';
import { Button } from '@/components/ui/button';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { DetailSection } from '@/components/session/detail-section';
import { PersonList, PersonRow } from '@/components/session/person-row';
import { SessionHeader } from '@/components/session/session-header';
import { SessionMap } from '@/components/session/session-map';
import { FontFamily, MaxContentWidth, ScreenPadding } from '@/constants/theme';
import { isFriend, useFriends } from '@/data/friends-store';
import { CURRENT_USER } from '@/data/people';
import {
  declineSession,
  deleteSession,
  isAttending,
  isCreator,
  isInvited,
  joinSession,
  leaveSession,
  useSession,
} from '@/data/session-store';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useTheme } from '@/hooks/use-theme';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useSession(id);
  const segments = useSegments();
  const theme = useTheme();
  const bottomTabInset = useBottomTabInset();
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const friends = useFriends();

  // Session might have been deleted
  if (!session) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.notFound}>
          <BackButton />
          <Text style={[styles.notFoundText, { color: theme.text }]}>
            This session doesn&apos;t exist anymore.
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const going = isAttending(session);
  const mine = isCreator(session);
  const invitedMe = isInvited(session);
  const ended = session.endsAt < new Date();
  const notGoing = (session.invited?.length ?? 0) + (session.declined?.length ?? 0);
  const friendsGoing = session.attendees.filter((person) => isFriend(friends, person.id));
  const attendees = [...session.attendees].sort(
    (a, b) => Number(b.id === CURRENT_USER.id) - Number(a.id === CURRENT_USER.id)
  );

  const editSession = () =>
    router.push(
      segments[0] === 'my-sessions'
        ? { pathname: '/my-sessions/session/edit/[id]', params: { id: session.id } }
        : { pathname: '/session/edit/[id]', params: { id: session.id } }
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.backRow}>
            <BackButton />
          </View>

          <View style={styles.sections}>
            <SessionHeader session={session} />

            <DetailSection title="Description">
              <Text style={[styles.description, { color: theme.textMuted }]}>
                {session.description}
              </Text>
            </DetailSection>

            {session.coordinates && (
              <DetailSection title="Location">
                <SessionMap coordinates={session.coordinates} label={session.location} />
              </DetailSection>
            )}

            <DetailSection title="Session creator">
              <PersonRow person={session.creator} status={null} />
            </DetailSection>

            {friendsGoing.length > 0 && (
              <DetailSection title="Friends going">
                <PersonList people={friendsGoing} />
              </DetailSection>
            )}

            <DetailSection title="Attendee list">
              <PersonList people={attendees} />
            </DetailSection>

            {/* Only the creator sees who's invited */}
            {mine && notGoing > 0 && (
              <DetailSection title="Invited">
                <PersonList people={[]} invited={session.invited} declined={session.declined} />
              </DetailSection>
            )}

            {/* Creator can delete, attendees can leave */}
            {ended ? null : mine ? (
              <Button
                label="Delete session"
                variant="destructiveText"
                onPress={() => setConfirmingDelete(true)}
              />
            ) : (
              going && (
                <Button
                  label="Leave session"
                  variant="destructiveText"
                  onPress={() => setConfirmingLeave(true)}
                />
              )
            )}
          </View>
        </ScrollView>

        {/* Edit if it's yours, Decline/Accept if you're invited, otherwise Join or Going */}
        <View style={[styles.footer, { paddingBottom: bottomTabInset + 16 }]}>
          {ended ? (
            <Text style={[styles.ended, { color: theme.textSecondary }]}>
              This session has ended.
            </Text>
          ) : mine ? (
            <Button label="Edit session" onPress={editSession} />
          ) : invitedMe ? (
            <View style={styles.responseRow}>
              <Button
                label="Decline"
                variant="destructive"
                flex
                onPress={() => declineSession(session.id)}
              />
              <Button label="Accept" flex onPress={() => joinSession(session.id)} />
            </View>
          ) : going ? (
            <Button label="Going" icon={CheckBadgeIcon} />
          ) : (
            <Button label="Join session" onPress={() => joinSession(session.id)} />
          )}
        </View>
      </SafeAreaView>

      <ConfirmSheet
        visible={confirmingLeave}
        title="Do you want to leave this session?"
        message="If you leave, you will be removed from the attendee list and people that are attending will be notified."
        confirmLabel="Leave session"
        tone="destructive"
        onCancel={() => setConfirmingLeave(false)}
        onConfirm={() => {
          leaveSession(session.id);
          setConfirmingLeave(false);
        }}
      />

      <ConfirmSheet
        visible={confirmingDelete}
        title="Do you want to delete this session?"
        message="It will be removed for you and everyone you invited. This can't be undone."
        confirmLabel="Delete session"
        tone="destructive"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          router.back();
          // Wait for the page to close first so it doesn't flash "doesn't exist"
          setTimeout(() => deleteSession(session.id), 400);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: ScreenPadding,
    paddingTop: ScreenPadding,
    paddingBottom: 24,
    gap: 24,
  },
  backRow: {
    flexDirection: 'row',
  },
  sections: {
    gap: 32,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  footer: {
    gap: 8,
    paddingHorizontal: ScreenPadding,
    paddingTop: 12,
  },
  ended: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 8,
  },
  responseRow: {
    flexDirection: 'row',
    gap: 8,
  },
  notFound: {
    flex: 1,
    padding: ScreenPadding,
    gap: 24,
  },
  notFoundText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
