import { router } from 'expo-router';

import { SessionSummary } from '@/components/create/session-summary';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { draftToNewSession, useCreateDraft } from '@/data/create-draft';
import { findFriend } from '@/data/people';
import { createSession } from '@/data/session-store';
import { SPORT_IMAGES } from '@/data/sessions';

// Step 6: check everything then create it
export default function CreateSummaryScreen() {
  const draft = useCreateDraft();
  const session = draftToNewSession(draft);
  // Can't skip the earlier steps so everything should be filled in
  if (!session) return null;

  const invited = session.invitedIds.flatMap((id) => findFriend(id) ?? []);

  const create = () => {
    const id = createSession(session);
    // Replace this screen so you can't go back to the summary
    router.replace({ pathname: '/create/created', params: { id } });
  };

  return (
    <StepScreen
      title="Session Summary"
      showBack
      centerTitle
      footer={<Button label="Create session" onPress={create} />}>
      <SessionSummary
        title={session.title}
        image={session.photoUri ? { uri: session.photoUri } : SPORT_IMAGES[session.sport]}
        sport={session.sport}
        type={session.type}
        level={session.level}
        invited={invited}
        startsAt={session.startsAt}
        endsAt={session.endsAt}
        location={session.location}
        coordinates={session.coordinates}
      />
    </StepScreen>
  );
}
