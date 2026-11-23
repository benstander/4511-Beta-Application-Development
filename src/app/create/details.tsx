import { router } from 'expo-router';

import { PhotoField } from '@/components/create/photo-field';
import { SessionTypeInfo } from '@/components/create/session-type-info';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { ChoicePills } from '@/components/ui/choice-pills';
import { FormField } from '@/components/ui/form-field';
import { NativeMenuField, type MenuOption } from '@/components/ui/native-menu-field';
import { TextField } from '@/components/ui/text-field';
import { SessionLevelColors, type SessionLevel } from '@/constants/theme';
import { detailsComplete, updateCreateDraft, useCreateDraft } from '@/data/create-draft';
import { SESSION_TYPES, SPORTS, type Sport } from '@/types/session';

const SPORT_OPTIONS: MenuOption<Sport>[] = SPORTS.map((sport) => ({ label: sport, value: sport }));

const LEVEL_OPTIONS: MenuOption<SessionLevel>[] = [
  { label: 'Social', value: 'social' },
  { label: 'Competitive', value: 'competitive' },
  { label: 'Beginner', value: 'beginner' },
];

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
      <FormField label="Session type" labelAccessory={<SessionTypeInfo />} style={{ gap: 10 }}>
        <ChoicePills
          label="Session type"
          options={SESSION_TYPES}
          selected={draft.type}
          onSelect={(type) => updateCreateDraft({ type })}
        />
      </FormField>

      <FormField label="Activity">
        <NativeMenuField
          placeholder="Select activity"
          options={SPORT_OPTIONS}
          selected={draft.sport}
          onChange={(sport) => updateCreateDraft({ sport })}
          allowAny={false}
        />
      </FormField>

      <FormField label="Session name">
        <TextField
          value={draft.title}
          onChangeText={(title) => updateCreateDraft({ title })}
          placeholder="e.g. Soccer game"
          accessibilityLabel="Session name"
          maxLength={40}
        />
      </FormField>

      <FormField label="Skill level">
        <NativeMenuField
          placeholder="Select level"
          options={LEVEL_OPTIONS}
          selected={draft.level}
          onChange={(level) => updateCreateDraft({ level })}
          allowAny={false}
          badgeColor={(level) => SessionLevelColors[level]}
        />
      </FormField>

      <FormField label="Cover photo">
        <PhotoField uri={draft.photoUri} onChange={(photoUri) => updateCreateDraft({ photoUri })} />
      </FormField>
    </StepScreen>
  );
}
