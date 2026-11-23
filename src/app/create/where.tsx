import { router } from 'expo-router';

import { LocationField } from '@/components/create/location-search';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 3: location
export default function CreateWhereScreen() {
  const draft = useCreateDraft();

  return (
    <StepScreen
      title="Where is your session?"
      showBack
      footer={
        <Button
          label="Describe the session"
          disabled={draft.place === null}
          onPress={() => router.push('/create/describe')}
        />
      }>
      <FormField label="Location">
        <LocationField draft={draft} onChange={updateCreateDraft} />
      </FormField>
    </StepScreen>
  );
}
