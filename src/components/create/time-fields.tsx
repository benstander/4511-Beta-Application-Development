import { Host } from '@expo/ui/swift-ui';
import { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { FieldTrigger } from '@/components/ui/field-trigger';
import { FormField } from '@/components/ui/form-field';
import { PickerSheet } from '@/components/ui/picker-sheet';
import type { DraftFieldsProps } from '@/data/create-draft';
import {
  dateAtMinutes,
  dateFromKey,
  dateKey,
  formatDateKey,
  minutesOf,
} from '@/utils/date-key';

type Picker = 'date' | 'start' | 'end';

// Date, start and end time fields
export function TimeFields({ draft, onChange }: DraftFieldsProps) {
  const scheme = useColorScheme();
  const [openPicker, setOpenPicker] = useState<Picker | null>(null);
  const [lastPicker, setLastPicker] = useState<Picker>('date');

  const startMinutes = draft.startMinutes ?? minutesOf(new Date());
  const lastMinute = 23 * 60 + 59;

  const pickers = {
    date: {
      title: 'Date',
      mode: 'date' as const,
      initialValue: draft.date ? dateFromKey(draft.date) : new Date(),
      minimumValue: dateFromKey(dateKey(new Date())),
      done: (value: Date) => onChange({ date: dateKey(value) }),
      clear: () => onChange({ date: null }),
    },
    start: {
      title: 'Start time',
      mode: 'time' as const,
      initialValue: draft.startMinutes === null ? new Date() : dateAtMinutes(draft.startMinutes),
      minimumValue: undefined,
      done: (value: Date) => {
        const start = minutesOf(value);
        // Clear the end time if it's no longer after the start
        if (draft.endMinutes !== null && draft.endMinutes <= start) {
          onChange({ startMinutes: start, endMinutes: null });
        } else {
          onChange({ startMinutes: start });
        }
      },
      clear: () => onChange({ startMinutes: null }),
    },
    end: {
      title: 'End time',
      mode: 'time' as const,
      initialValue: dateAtMinutes(draft.endMinutes ?? Math.min(startMinutes + 60, lastMinute)),
      // Has to end after it starts
      minimumValue: dateAtMinutes(Math.min(startMinutes + 1, lastMinute)),
      done: (value: Date) => onChange({ endMinutes: minutesOf(value) }),
      clear: () => onChange({ endMinutes: null }),
    },
  };
  const picker = pickers[openPicker ?? lastPicker];
  const open = (which: Picker) => {
    setLastPicker(which);
    setOpenPicker(which);
  };

  return (
    <>
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
          minimumValue={picker.minimumValue}
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
    </>
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
