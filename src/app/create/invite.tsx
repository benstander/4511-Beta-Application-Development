import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { FriendInvites } from '@/components/create/friend-invites';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FontFamily } from '@/constants/theme';
import {
  INVITE_HINTS,
  invitesRequired,
  updateCreateDraft,
  useCreateDraft,
} from '@/data/create-draft';
import { useTheme } from '@/hooks/use-theme';

// Step 5: invite friends. Solo sessions skip this step.
// Public and Friends-only can skip it, Invite-only needs at least one person
export default function CreateInviteScreen() {
  const draft = useCreateDraft();
  const theme = useTheme();
  const anyInvited = draft.invitedIds.length > 0;
  const blocked = invitesRequired(draft.type) && !anyInvited;
  const hint = draft.type ? INVITE_HINTS[draft.type] : undefined;

  return (
    <StepScreen
      title="Invite friends"
      showBack
      footer={
        <Button
          label={anyInvited || blocked ? 'Confirm session' : 'Skip'}
          disabled={blocked}
          onPress={() => router.push('/create/summary')}
        />
      }>
      {hint && <Text style={[styles.hint, { color: theme.textSecondary }]}>{hint}</Text>}
      <FriendInvites draft={draft} onChange={updateCreateDraft} />
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
  },
});
