import { Host } from '@expo/ui/swift-ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { FieldTrigger } from '@/components/ui/field-trigger';
import { FormField } from '@/components/ui/form-field';
import { PickerSheet } from '@/components/ui/picker-sheet';
import { timesComplete, updateCreateDraft, useCreateDraft } from '@/data/create-draft';
import {
  dateAtMinutes,
  dateFromKey,
  dateKey,
  formatDateKey,
  minutesOf,
} from '@/utils/date-key';

type Picker = 'date' | 'start' | 'end';

// Step 2: date, start and end time
export default function CreateWhenScreen() {
  const draft = useCreateDraft();
  const scheme = useColorScheme();
  const [openPicker, setOpenPicker] = useState<Picker | null>(null);
  const [lastPicker, setLastPicker] = useState<Picker>('date');

  const pickers = {
    date: {
      title: 'Date',
      mode: 'date' as const,
      initialValue: draft.date ? dateFromKey(draft.date) : new Date(),
      done: (value: Date) => updateCreateDraft({ date: dateKey(value) }),
      clear: () => updateCreateDraft({ date: null }),
    },
    start: {
      title: 'Start time',
      mode: 'time' as const,
      initialValue: draft.startMinutes === null ? new Date() : dateAtMinutes(draft.startMinutes),
      done: (value: Date) => updateCreateDraft({ startMinutes: minutesOf(value) }),
      clear: () => updateCreateDraft({ startMinutes: null }),
    },
    end: {
      title: 'End time',
      mode: 'time' as const,
      initialValue: draft.endMinutes === null ? new Date() : dateAtMinutes(draft.endMinutes),
      done: (value: Date) => updateCreateDraft({ endMinutes: minutesOf(value) }),
      clear: () => updateCreateDraft({ endMinutes: null }),
    },
  };
  const picker = pickers[openPicker ?? lastPicker];
  const open = (which: Picker) => {
    setLastPicker(which);
    setOpenPicker(which);
  };

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
      <FormField label="Date">
        <FieldTrigger
          text={draft.date ? formatDateKey(draft.date) : 'DD/MM/YYYY'}
          open={openPicker === 'date'}
          onPress={() => open('date')}
        />
      </FormField>

      <View style={styles.timeRow}>
        <FormField label="Start time" style={styles.timeField}>
          <FieldTrigger
            text={draft.startMinutes === null ? 'e.g. 11:00am' : formatTime(draft.startMinutes)}
            open={openPicker === 'start'}
            onPress={() => open('start')}
          />
        </FormField>
        <FormField label="End time" style={styles.timeField}>
          <FieldTrigger
            text={draft.endMinutes === null ? 'e.g. 1:00pm' : formatTime(draft.endMinutes)}
            open={openPicker === 'end'}
            onPress={() => open('end')}
          />
        </FormField>
      </View>

      {/* Needed to show the native picker sheet */}
      <Host style={styles.host} colorScheme={scheme === 'dark' ? 'dark' : 'light'}>
        <PickerSheet
          visible={openPicker !== null}
          title={picker.title}
          mode={picker.mode}
          initialValue={picker.initialValue}
          onClose={() => setOpenPicker(null)}
          onClear={() => {
            picker.clear();
            setOpenPicker(null);
          }}
          onDone={(value) => {
            picker.done(value);
            setOpenPicker(null);
          }}
        />
      </Host>
    </StepScreen>
  );
}

// e.g. 11:00am
function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes % 60).padStart(2, '0')}${hours < 12 ? 'am' : 'pm'}`;
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  host: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
