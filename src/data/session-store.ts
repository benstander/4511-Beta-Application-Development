import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { CURRENT_USER } from '@/data/people';
import { SAMPLE_SESSIONS } from '@/data/sessions';
import type { Session } from '@/types/session';

// Sessions shared by every screen, from SAMPLE_SESSIONS.
// Joined session ids are saved in AsyncStorage so they stay after closing the app

const STORAGE_KEY = 'beta-app/joined-session-ids';

type State = {
  joinedIds: Set<string>;
  sessions: Session[];
};

function buildState(joinedIds: Set<string>): State {
  return {
    joinedIds,
    sessions: SAMPLE_SESSIONS.map((session) =>
      joinedIds.has(session.id)
        ? { ...session, attendees: [...session.attendees, CURRENT_USER] }
        : session
    ),
  };
}

let state = buildState(new Set());
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setJoinedIds(joinedIds: Set<string>) {
  state = buildState(joinedIds);
  emit();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...joinedIds])).catch((error) =>
    console.warn('Could not save joined sessions', error)
  );
}

let hydratePromise: Promise<void> | undefined;
export function hydrateSessionStore() {
  if (hydratePromise) return hydratePromise;
  hydratePromise = AsyncStorage.getItem(STORAGE_KEY)
    .then((raw) => {
      const ids = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(ids)) {
        state = buildState(new Set(ids.filter((id) => typeof id === 'string')));
      }
    })
    .catch((error) => console.warn('Could not load joined sessions', error))
    .finally(() => {
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

// Sessions for each My Sessions tab
export function useMySessions(now = new Date()) {
  const sessions = useSessions();
  const going = sessions.filter((s) => isAttending(s) && s.endsAt >= now);
  const history = sessions.filter((s) => isAttending(s) && s.endsAt < now);
  const created = sessions.filter((s) => s.creator.id === CURRENT_USER.id);
  return { going, created, history };
}
