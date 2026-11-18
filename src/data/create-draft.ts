import { useSyncExternalStore } from 'react';

import type { SessionLevel } from '@/constants/theme';
import type { SessionType, Sport } from '@/types/session';

// The session being made in the Create tab. Shared between all the steps
export type CreateDraft = {
  title: string;
  type: SessionType | null;
  sport: Sport | null;
  level: SessionLevel | null;
  photoUri: string | null;
  date: string | null;
  startMinutes: number | null;
  endMinutes: number | null;
  location: string;
  description: string;
  invitedIds: string[];
};

const EMPTY_DRAFT: CreateDraft = {
  title: '',
  type: null,
  sport: null,
  level: null,
  photoUri: null,
  date: null,
  startMinutes: null,
  endMinutes: null,
  location: '',
  description: '',
  invitedIds: [],
};

let draft = EMPTY_DRAFT;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCreateDraft() {
  return useSyncExternalStore(
    subscribe,
    () => draft,
    () => draft
  );
}

export function updateCreateDraft(patch: Partial<CreateDraft>) {
  // New object so React re-renders
  draft = { ...draft, ...patch };
  listeners.forEach((listener) => listener());
}

export function toggleInvite(personId: string) {
  updateCreateDraft({
    invitedIds: draft.invitedIds.includes(personId)
      ? draft.invitedIds.filter((id) => id !== personId)
      : [...draft.invitedIds, personId],
  });
}

export function resetCreateDraft() {
  draft = EMPTY_DRAFT;
  listeners.forEach((listener) => listener());
}

// Step 1 done? (name, type, activity and level)
export function detailsComplete(d: CreateDraft) {
  return d.title.trim() !== '' && d.type !== null && d.sport !== null && d.level !== null;
}

// Step 2 done? (date, start and end time)
export function timesComplete(d: CreateDraft) {
  return d.date !== null && d.startMinutes !== null && d.endMinutes !== null;
}
