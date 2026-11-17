import { router } from 'expo-router';

import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { TextField } from '@/components/ui/text-field';
import { updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 4: description
export default function CreateDescribeScreen() {
  const draft = useCreateDraft();

  return (
    <StepScreen
      title="How would you describe your session?"
      showBack
      footer={
        <Button
          label="Find friends"
          disabled={draft.description.trim() === ''}
          onPress={() => router.push('/create/invite')}
        />
      }>
      <FormField label="Description">
        <TextField
          value={draft.description}
          onChangeText={(description) => updateCreateDraft({ description })}
          placeholder="Talk about what will happen...."
          accessibilityLabel="Description"
          multiline
          maxLength={600}
        />
      </FormField>
    </StepScreen>
  );
}
