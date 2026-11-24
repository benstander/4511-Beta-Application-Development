import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { DetailsFields } from '@/components/create/details-fields';
import { FriendInvites } from '@/components/create/friend-invites';
import { LocationField } from '@/components/create/location-search';
import { TimeFields } from '@/components/create/time-fields';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { TextField } from '@/components/ui/text-field';
import { FontFamily } from '@/constants/theme';
import {
  EMPTY_DRAFT,
  draftFromSession,
  draftToNewSession,
  hasInvites,
  type CreateDraft,
} from '@/data/create-draft';
import { updateSession, useSession } from '@/data/session-store';
import { useTheme } from '@/hooks/use-theme';

// Edit a session you made. All the Create fields on one screen
export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useSession(id);
  const theme = useTheme();
  const [form, setForm] = useState<CreateDraft>(() =>
    session ? draftFromSession(session) : EMPTY_DRAFT
  );
  const onChange = (patch: Partial<CreateDraft>) => setForm((current) => ({ ...current, ...patch }));
  const updated = draftToNewSession(form);

  if (!session) {
    return (
      <StepScreen title="Edit session" footer={<Button label="Go back" onPress={() => router.back()} />}>
        <Text style={[styles.missing, { color: theme.textSecondary }]}>
          This session doesn&apos;t exist anymore.
        </Text>
      </StepScreen>
    );
  }

  const save = () => {
    if (!updated) return;
    updateSession(session.id, updated);
    router.back();
  };

  return (
    <StepScreen
      title="Edit session"
      showBack
      footer={<Button label="Save changes" disabled={!updated} onPress={save} />}>
      <DetailsFields draft={form} onChange={onChange} />
      <TimeFields draft={form} onChange={onChange} />
      <FormField label="Location" required>
        <LocationField draft={form} onChange={onChange} />
      </FormField>
      <FormField label="Description" required>
        <TextField
          value={form.description}
          onChangeText={(description) => onChange({ description })}
          placeholder="Talk about what will happen...."
          accessibilityLabel="Description"
          multiline
          maxLength={600}
        />
      </FormField>
      {hasInvites(form.type) && <FriendInvites draft={form} onChange={onChange} />}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  missing: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
});
