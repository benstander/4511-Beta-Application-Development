import { router } from 'expo-router';

import { DetailsFields } from '@/components/create/details-fields';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { detailsComplete, updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 1: session details
export default function CreateDetailsScreen() {
  const draft = useCreateDraft();

  return (
    <StepScreen
      title="Create session"
      showBack
      footer={
        <Button
          label="Select times"
          disabled={!detailsComplete(draft)}
          onPress={() => router.push('/create/when')}
        />
      }>
      <DetailsFields draft={draft} onChange={updateCreateDraft} />
    </StepScreen>
  );
}
