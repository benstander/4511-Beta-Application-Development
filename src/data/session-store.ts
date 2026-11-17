import { useSyncExternalStore } from 'react';

import { CURRENT_USER } from '@/data/people';
import { SAMPLE_SESSIONS } from '@/data/sessions';
import type { Session } from '@/types/session';

// Sessions shared by every screen, from SAMPLE_SESSIONS.
// Only joined sessions can change for now. Kept in memory so it resets on restart

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
