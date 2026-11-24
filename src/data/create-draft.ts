import { useSyncExternalStore } from 'react';

import type { SessionLevel } from '@/constants/theme';
import type { Place } from '@/data/places';
import type { NewSession } from '@/data/session-store';
import type { Session, SessionType, Sport } from '@/types/session';
import { dateFromKeyAt, dateKey, minutesOf } from '@/utils/date-key';

// The session being made in the Create tab. Shared between all the steps.
// Edit session uses the same shape

// Solo sessions don't invite anyone
export function hasInvites(type: SessionType | null) {
  return type !== 'Solo';
}

// Invite-only needs at least one person invited
export function invitesRequired(type: SessionType | null) {
  return type === 'Invite-only';
}

export const INVITE_HINTS: Partial<Record<SessionType, string>> = {
  Public: 'Anyone can join. Invite friends to let them know.',
  'Friends-only': 'All your friends can join. Invite some to give them a nudge.',
  'Invite-only': 'Only people you invite will see this session.',
};

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
  place: Place | null;
  description: string;
  invitedIds: string[];
};

export const EMPTY_DRAFT: CreateDraft = {
  title: '',
  type: null,
  sport: null,
  level: null,
  photoUri: null,
  date: null,
  startMinutes: null,
  endMinutes: null,
  location: '',
  place: null,
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

export type DraftFieldsProps = {
  draft: CreateDraft;
  onChange: (patch: Partial<CreateDraft>) => void;
};

// Turn a saved session into the form so it can be edited
export function draftFromSession(session: Session): CreateDraft {
  const { image, coordinates } = session;
  return {
    title: session.title,
    type: session.type ?? 'Public',
    sport: session.sport,
    level: session.level,
    // Only picked photos have a uri
    photoUri: typeof image === 'object' && image.uri ? image.uri : null,
    date: dateKey(session.startsAt),
    startMinutes: minutesOf(session.startsAt),
    endMinutes: minutesOf(session.endsAt),
    location: session.location,
    // Location already has the suburb in it
    place: coordinates ? { name: session.location, area: '', ...coordinates } : null,
    description: session.description,
    // Everyone invited, whether they said yes, no or haven't answered
    invitedIds: [
      ...session.attendees.filter((person) => person.id !== session.creator.id),
      ...(session.invited ?? []),
      ...(session.declined ?? []),
    ].map((person) => person.id),
  };
}

// Turns the draft into a session, or null if something's missing
// (Invite-only also needs someone invited)
export function draftToNewSession(d: CreateDraft): NewSession | null {
  const { type, sport, level, date, startMinutes, endMinutes, place } = d;
  if (
    !type ||
    !sport ||
    !level ||
    date === null ||
    startMinutes === null ||
    endMinutes === null ||
    !place ||
    d.title.trim() === '' ||
    d.description.trim() === '' ||
    (invitesRequired(type) && d.invitedIds.length === 0)
  ) {
    return null;
  }
  return {
    title: d.title.trim(),
    sport,
    level,
    type,
    startsAt: dateFromKeyAt(date, startMinutes),
    endsAt: dateFromKeyAt(date, endMinutes),
    location: d.location.trim(),
    coordinates: { latitude: place.latitude, longitude: place.longitude },
    description: d.description.trim(),
    // Solo sessions have no invites
    invitedIds: hasInvites(type) ? d.invitedIds : [],
    photoUri: d.photoUri,
  };
}
