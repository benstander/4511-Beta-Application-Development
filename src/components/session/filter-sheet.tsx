import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterPills } from '@/components/session/filter-pills';
import { Button } from '@/components/ui/button';
import { FieldTrigger } from '@/components/ui/field-trigger';
import { FormField } from '@/components/ui/form-field';
import { NativeSheet } from '@/components/ui/native-sheet';
import { PickerSheet } from '@/components/ui/picker-sheet';
import { NativeMenuField, type MenuOption } from '@/components/ui/native-menu-field';
import { SearchField } from '@/components/ui/search-field';
import { FontFamily, type SessionLevel } from '@/constants/theme';
import { EMPTY_FILTERS, formatMinutes, type SessionFilters } from '@/data/session-filters';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';
import { dateAtMinutes, dateFromKey, dateKey, formatDateKey, minutesOf } from '@/utils/date-key';

type FilterSheetProps = {
  visible: boolean;
  filters: SessionFilters;
  sessions: Session[];
  onApply: (filters: SessionFilters) => void;
  onClose: () => void;
};

type OpenPicker = 'date' | 'start' | 'end' | null;

const LEVEL_OPTIONS: MenuOption<SessionLevel>[] = [
  { label: 'Social', value: 'social' },
  { label: 'Competitive', value: 'competitive' },
  { label: 'Beginner', value: 'beginner' },
];

const DEFAULT_START_MINUTES = 9 * 60; // 9am
const DEFAULT_END_MINUTES = 21 * 60; // 9pm

// Filters popup. Uses the native iOS pickers for level, date and times.
// Nothing changes until you press Apply filters
export function FilterSheet({ visible, filters, sessions, onApply, onClose }: FilterSheetProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState(filters);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setDraft(filters);
      setOpenPicker(null);
    }
  }

  const today = dateKey(new Date());
  const upcoming = sessions.map((s) => dateKey(s.startsAt)).filter((key) => key >= today).sort();
  const defaultDateKey = upcoming[0] ?? today;

  const update = (patch: Partial<SessionFilters>) => setDraft((d) => ({ ...d, ...patch }));

  const pickerConfig = {
    date: {
      title: 'Date',
      mode: 'date' as const,
      initialValue: dateFromKey(draft.date ?? defaultDateKey),
      done: (value: Date) => update({ date: dateKey(value) }),
      clear: () => update({ date: null }),
    },
    start: {
      title: 'Start time',
      mode: 'time' as const,
      initialValue: dateAtMinutes(draft.startMinutes ?? DEFAULT_START_MINUTES),
      done: (value: Date) => update({ startMinutes: minutesOf(value) }),
      clear: () => update({ startMinutes: null }),
    },
    end: {
      title: 'End time',
      mode: 'time' as const,
      initialValue: dateAtMinutes(draft.endMinutes ?? DEFAULT_END_MINUTES),
      done: (value: Date) => update({ endMinutes: minutesOf(value) }),
      clear: () => update({ endMinutes: null }),
    },
  };
  const [lastPicker, setLastPicker] = useState<Exclude<OpenPicker, null>>('date');
  const openPickerSheet = (picker: Exclude<OpenPicker, null>) => {
    setLastPicker(picker);
    setOpenPicker(picker);
  };
  const picker = pickerConfig[openPicker ?? lastPicker];

  return (
    <NativeSheet
      visible={visible}
      onClose={onClose}
      overlay={
        // Picker sheet has to be inside this one so iOS shows it on top
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
      }>
      <View style={styles.header}>
        <Text role="heading" style={[styles.title, { color: theme.text }]}>
          Filters
        </Text>
        <Pressable onPress={onClose} role="button" accessibilityLabel="Close filters" hitSlop={10}>
          <Image
            source={require('@/assets/icons/x-mark.svg')}
            style={styles.close}
            tintColor={theme.text}
          />
        </Pressable>
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.fields}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Pills for what's picked so far */}
        <FilterPills filters={draft} onChange={setDraft} />

        <FormField label="Location">
          <SearchField
            value={draft.location}
            onChangeText={(location) => update({ location })}
            onFocus={() => setOpenPicker(null)}
            placeholder="Find nearby sessions...."
          />
        </FormField>

        <FormField label="Skill level">
          <NativeMenuField
            placeholder="Select level"
            anyLabel="Any level"
            options={LEVEL_OPTIONS}
            selected={draft.level}
            onChange={(level) => update({ level })}
          />
        </FormField>

        <FormField label="Date">
          <FieldTrigger
            text={draft.date ? formatDateKey(draft.date) : 'DD/MM/YYYY'}
            open={openPicker === 'date'}
            onPress={() => openPickerSheet('date')}
          />
        </FormField>

        <View style={styles.timeRow}>
          <FormField label="Start time" style={styles.timeField}>
            <FieldTrigger
              text={draft.startMinutes === null ? 'Any' : formatMinutes(draft.startMinutes)}
              open={openPicker === 'start'}
              onPress={() => openPickerSheet('start')}
            />
          </FormField>
          <FormField label="End time" style={styles.timeField}>
            <FieldTrigger
              text={draft.endMinutes === null ? 'Any' : formatMinutes(draft.endMinutes)}
              open={openPicker === 'end'}
              onPress={() => openPickerSheet('end')}
            />
          </FormField>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Clear"
          variant="secondary"
          flex
          onPress={() => {
            setDraft(EMPTY_FILTERS);
            setOpenPicker(null);
          }}
        />
        <Button label="Apply filters" flex onPress={() => onApply(draft)} />
      </View>
    </NativeSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
  },
  close: {
    width: 24,
    height: 24,
  },
  body: {
    flex: 1,
  },
  fields: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
