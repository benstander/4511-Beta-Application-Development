import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { SessionSummary } from '@/components/create/session-summary';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { resetCreateDraft } from '@/data/create-draft';
import { useSession } from '@/data/session-store';
import { SPORT_IMAGES } from '@/data/sessions';

// Last step, the session is made. You can copy a link or go see it in My Sessions
export default function CreateCreatedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useSession(id);
  const [copied, setCopied] = useState(false);

  // Clear the form for next time
  useEffect(() => {
    resetCreateDraft();
  }, []);

  // Change "Link copied" back after 2 seconds
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    // Link that opens this session in the app
    await Clipboard.setStringAsync(Linking.createURL(`/session/${id}`));
    setCopied(true);
  };

  const viewMySessions = () => {
    // Go back to the first Create step, then open the session in My Sessions
    router.dismissAll();
    router.navigate({ pathname: '/my-sessions', params: { tab: 'Created' } });
  };

  return (
    <StepScreen
      title="Session created!"
      centerTitle
      footer={
        <>
          <Button
            label={copied ? 'Link copied' : 'Copy link to session'}
            variant="outline"
            icon={
              copied
                ? require('@/assets/icons/check-circle.svg')
                : require('@/assets/icons/link.svg')
            }
            iconPosition="leading"
            onPress={copyLink}
          />
          <Button label="View my sessions" onPress={viewMySessions} />
        </>
      }>
      {session?.type && (
        <SessionSummary
          title={session.title}
          image={session.image ?? SPORT_IMAGES[session.sport]}
          type={session.type}
          level={session.level}
          invited={session.invited ?? []}
          startsAt={session.startsAt}
          endsAt={session.endsAt}
          location={session.location}
          coordinates={session.coordinates}
          celebrate
        />
      )}
    </StepScreen>
  );
}
