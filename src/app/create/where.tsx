import { router } from 'expo-router';

import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { SearchField } from '@/components/ui/search-field';
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
          disabled={draft.location.trim() === ''}
          onPress={() => router.push('/create/describe')}
        />
      }>
      <FormField label="Location">
        <SearchField
          value={draft.location}
          onChangeText={(location) => updateCreateDraft({ location })}
          placeholder="Enter a location"
        />
      </FormField>
    </StepScreen>
  );
}
