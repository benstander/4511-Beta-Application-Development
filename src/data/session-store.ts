import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { SessionLevel } from '@/constants/theme';
import { CURRENT_USER, findFriend } from '@/data/people';
import { SAMPLE_SESSIONS, SPORT_IMAGES } from '@/data/sessions';
import type { Person, Session, SessionType, Sport } from '@/types/session';

// Sessions shared by every screen: SAMPLE_SESSIONS plus ones you made in Create.
// Joined ids and created sessions are saved in AsyncStorage so they stay after
// closing the app

const JOINED_KEY = 'beta-app/joined-session-ids';
const CREATED_KEY = 'beta-app/created-sessions';

type StoredSession = {
  id: string;
  title: string;
  sport: Sport;
  level: SessionLevel;
  type: SessionType;
  startsAt: string;
  endsAt: string;
  location: string;
  description: string;
  invitedIds: string[];
  photoUri: string | null;
};

export type NewSession = Omit<StoredSession, 'id' | 'startsAt' | 'endsAt'> & {
  startsAt: Date;
  endsAt: Date;
};

type State = {
  joinedIds: Set<string>;
  created: StoredSession[];
  sessions: Session[];
};

// e.g. "Just you", "Alex + 2 invited"
export function invitedSummary(invited: Person[]) {
  if (invited.length === 0) return 'Just you';
  if (invited.length === 1) return `${invited[0].name} invited`;
  return `${invited[0].name} + ${invited.length - 1} invited`;
}

function fromStored(stored: StoredSession): Session {
  const invited = stored.invitedIds.flatMap((id) => findFriend(id) ?? []);
  return {
    id: stored.id,
    title: stored.title,
    sport: stored.sport,
    level: stored.level,
    type: stored.type,
    image: stored.photoUri ? { uri: stored.photoUri } : SPORT_IMAGES[stored.sport],
    startsAt: new Date(stored.startsAt),
    endsAt: new Date(stored.endsAt),
    location: stored.location,
    description: stored.description,
    creator: CURRENT_USER,
    attendees: [CURRENT_USER],
    invited,
    attendeeSummary: invitedSummary(invited),
  };
}

function buildState(joinedIds: Set<string>, created: StoredSession[]): State {
  const samples = SAMPLE_SESSIONS.map((session) =>
    joinedIds.has(session.id)
      ? { ...session, attendees: [...session.attendees, CURRENT_USER] }
      : session
  );
  return {
    joinedIds,
    created,
    // Created sessions first, then the samples
    sessions: [...created.map(fromStored), ...samples],
  };
}

let state = buildState(new Set(), []);
let hydrated = false;
const listeners = new Set<() => void>();

// Tell every screen to re-render
function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Save in the background, just warn if it fails
function save(key: string, value: unknown) {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
    console.warn(`Could not save ${key}`, error)
  );
}

function setJoinedIds(joinedIds: Set<string>) {
  state = buildState(joinedIds, state.created);
  emit();
  save(JOINED_KEY, [...joinedIds]);
}

function setCreated(created: StoredSession[]) {
  state = buildState(state.joinedIds, created);
  emit();
  save(CREATED_KEY, created);
}

// If the saved data is missing or broken just use an empty list
function parseList(raw: string | null): unknown[] {
  try {
    const value = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let hydratePromise: Promise<void> | undefined;
export function hydrateSessionStore() {
  // Only load once
  if (hydratePromise) return hydratePromise;
  hydratePromise = Promise.all([
    AsyncStorage.getItem(JOINED_KEY),
    AsyncStorage.getItem(CREATED_KEY),
  ])
    .then(([joinedRaw, createdRaw]) => {
      const joined = parseList(joinedRaw).filter((id) => typeof id === 'string');
      const created = parseList(createdRaw) as StoredSession[];
      state = buildState(new Set(joined), created);
    })
    .catch((error) => console.warn('Could not load saved sessions', error))
    .finally(() => {
      // Still mark as ready if loading failed so the app opens
      hydrated = true;
      emit();
    });
  return hydratePromise;
}

export function useSessionStoreReady() {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false
  );
}

export function useSessions() {
  return useSyncExternalStore(
    subscribe,
    () => state.sessions,
    () => state.sessions
  );
}

export function useSession(id: string | undefined) {
  return useSessions().find((session) => session.id === id);
}

export function isAttending(session: Session, personId = CURRENT_USER.id) {
  return session.attendees.some((person) => person.id === personId);
}

export function isCreator(session: Session, personId = CURRENT_USER.id) {
  return session.creator.id === personId;
}

export function joinSession(id: string) {
  if (state.joinedIds.has(id)) return;
  setJoinedIds(new Set([...state.joinedIds, id]));
}

export function leaveSession(id: string) {
  if (!state.joinedIds.has(id)) return;
  const next = new Set(state.joinedIds);
  next.delete(id);
  setJoinedIds(next);
}

// Saves a new session and returns its id
export function createSession({ startsAt, endsAt, ...rest }: NewSession) {
  const id = `created-${Date.now()}`;
  const stored: StoredSession = {
    ...rest,
    id,
    // JSON can't store Dates so save them as text
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  };
  setCreated([stored, ...state.created]);
  return id;
}

export function deleteSession(id: string) {
  setCreated(state.created.filter((session) => session.id !== id));
}

// Sessions for each My Sessions tab
export function useMySessions(now = new Date()) {
  const sessions = useSessions();
  const going = sessions.filter((s) => isAttending(s) && s.endsAt >= now);
  const history = sessions.filter((s) => isAttending(s) && s.endsAt < now);
  const created = sessions.filter((s) => isCreator(s));
  return { going, created, history };
}
