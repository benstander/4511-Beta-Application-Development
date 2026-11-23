import { router } from 'expo-router';

import { TimeFields } from '@/components/create/time-fields';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { timesComplete, updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 2: date, start and end time
export default function CreateWhenScreen() {
  const draft = useCreateDraft();

  return (
    <StepScreen
      title="When is your session?"
      showBack
      footer={
        <Button
          label="Select location"
          disabled={!timesComplete(draft)}
          onPress={() => router.push('/create/where')}
        />
      }>
      <TimeFields draft={draft} onChange={updateCreateDraft} />
    </StepScreen>
  );
}
