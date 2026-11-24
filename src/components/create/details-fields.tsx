import { PhotoField } from '@/components/create/photo-field';
import { SessionTypeInfo } from '@/components/create/session-type-info';
import { ChoicePills } from '@/components/ui/choice-pills';
import { FormField } from '@/components/ui/form-field';
import { NativeMenuField, type MenuOption } from '@/components/ui/native-menu-field';
import { TextField } from '@/components/ui/text-field';
import { SessionLevelColors, type SessionLevel } from '@/constants/theme';
import type { DraftFieldsProps } from '@/data/create-draft';
import { SESSION_TYPES, SPORTS, type Sport } from '@/types/session';

const SPORT_OPTIONS: MenuOption<Sport>[] = SPORTS.map((sport) => ({ label: sport, value: sport }));

const LEVEL_OPTIONS: MenuOption<SessionLevel>[] = [
  { label: 'Social', value: 'social' },
  { label: 'Competitive', value: 'competitive' },
  { label: 'Beginner', value: 'beginner' },
];

// Type, activity, name, level and cover photo
export function DetailsFields({ draft, onChange }: DraftFieldsProps) {
  return (
    <>
      <FormField
        label="Session type"
        required
        labelAccessory={<SessionTypeInfo />}
        style={{ gap: 10 }}>
        <ChoicePills
          label="Session type"
          options={SESSION_TYPES}
          selected={draft.type}
          onSelect={(type) => onChange({ type })}
        />
      </FormField>

      <FormField label="Activity" required>
        <NativeMenuField
          placeholder="Select activity"
          options={SPORT_OPTIONS}
          selected={draft.sport}
          onChange={(sport) => onChange({ sport })}
          allowAny={false}
        />
      </FormField>

      <FormField label="Session name" required>
        <TextField
          value={draft.title}
          onChangeText={(title) => onChange({ title })}
          placeholder="e.g. Soccer game"
          accessibilityLabel="Session name"
          maxLength={40}
        />
      </FormField>

      <FormField label="Skill level" required>
        <NativeMenuField
          placeholder="Select level"
          options={LEVEL_OPTIONS}
          selected={draft.level}
          onChange={(level) => onChange({ level })}
          allowAny={false}
          badgeColor={(level) => SessionLevelColors[level]}
        />
      </FormField>

      <FormField label="Cover photo">
        <PhotoField uri={draft.photoUri} onChange={(photoUri) => onChange({ photoUri })} />
      </FormField>
    </>
  );
}
