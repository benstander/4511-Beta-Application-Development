import { router } from 'expo-router';
import { useState } from 'react';

import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { TextField } from '@/components/ui/text-field';
import { type ProfileDetails, updateProfile, useCurrentUser } from '@/data/profile-store';

// Edit your name and bio
export default function EditProfileScreen() {
  const me = useCurrentUser();
  const [form, setForm] = useState<ProfileDetails>({ name: me.name, bio: me.bio });
  const name = form.name.trim();

  const save = () => {
    if (!name) return;
    updateProfile({ name, bio: form.bio.trim() });
    router.back();
  };

  return (
    <StepScreen
      title="Edit profile"
      showBack
      footer={<Button label="Save changes" disabled={!name} onPress={save} />}>
      <FormField label="Name">
        <TextField
          value={form.name}
          onChangeText={(text) => setForm((current) => ({ ...current, name: text }))}
          placeholder="Your name"
          accessibilityLabel="Name"
          maxLength={30}
        />
      </FormField>
      <FormField label="Bio">
        <TextField
          value={form.bio}
          onChangeText={(text) => setForm((current) => ({ ...current, bio: text }))}
          placeholder="Tell people what you're into...."
          accessibilityLabel="Bio"
          multiline
          maxLength={120}
        />
      </FormField>
    </StepScreen>
  );
}
