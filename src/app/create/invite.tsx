import { router } from 'expo-router';

import { FriendInvites } from '@/components/create/friend-invites';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 5: invite friends. Solo sessions skip this
export default function CreateInviteScreen() {
  const draft = useCreateDraft();

  return (
    <StepScreen
      title="Invite friends"
      showBack
      footer={<Button label="Confirm session" onPress={() => router.push('/create/summary')} />}>
      <FriendInvites draft={draft} onChange={updateCreateDraft} />
    </StepScreen>
  );
}
