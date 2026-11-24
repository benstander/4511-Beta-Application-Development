import { router } from 'expo-router';

import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { TextField } from '@/components/ui/text-field';
import { hasInvites, updateCreateDraft, useCreateDraft } from '@/data/create-draft';

// Step 4: description
export default function CreateDescribeScreen() {
  const draft = useCreateDraft();
  const invites = hasInvites(draft.type);

  return (
    <StepScreen
      title="How would you describe your session?"
      showBack
      footer={
        <Button
          label={invites ? 'Find friends' : 'Confirm session'}
          disabled={draft.description.trim() === ''}
          // Solo sessions skip the invite step
          onPress={() => router.push(invites ? '/create/invite' : '/create/summary')}
        />
      }>
      <FormField label="Description" required>
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
