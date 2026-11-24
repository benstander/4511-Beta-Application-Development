import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { SessionLevel } from '@/constants/theme';
import { CURRENT_USER, findPerson } from '@/data/people';
import { SAMPLE_SESSIONS, SPORT_IMAGES } from '@/data/sessions';
import type { Coordinates, Person, Session, SessionType, Sport } from '@/types/session';

// Sessions shared by every screen: SAMPLE_SESSIONS plus ones you made in Create.
// Joined ids, declined ids and created sessions are saved in AsyncStorage so they
// stay after closing the app

const JOINED_KEY = 'beta-app/joined-session-ids';
const DECLINED_KEY = 'beta-app/declined-session-ids';
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
  coordinates?: Coordinates;
  description: string;
  invitedIds: string[];
  acceptedIds?: string[];
  declinedIds?: string[];
  photoUri: string | null;
};

const EXAMPLE_CREATED: StoredSession[] = [
  {
    id: 'created-example-soccer',
    title: 'Sunday soccer',
    sport: 'Soccer',
    level: 'social',
    type: 'Friends-only',
    startsAt: new Date(2027, 10, 14, 9, 0).toISOString(),
    endsAt: new Date(2027, 10, 14, 11, 0).toISOString(),
    location: 'Fred Caterson, Castle Hill',
    coordinates: { latitude: -33.71835, longitude: 150.98357 },
    description:
      'Relaxed Sunday morning game with the usual crew. Bring a light and a dark shirt so we can split teams.',
    invitedIds: ['alex', 'john', 'james', 'carter', 'sarah'],
    acceptedIds: ['alex', 'john'],
    declinedIds: ['sarah'],
    photoUri: null,
  },
  {
    id: 'created-example-run',
    title: 'Evening run club',
    sport: 'Running',
    level: 'beginner',
    type: 'Invite-only',
    startsAt: new Date(2027, 10, 18, 18, 0).toISOString(),
    endsAt: new Date(2027, 10, 18, 19, 0).toISOString(),
    location: 'Samantha riley dr, Kellyville',
    coordinates: { latitude: -33.71005, longitude: 150.93852 },
    description: 'An easy 6km loop after work, chatting pace. Everyone runs together.',
    invitedIds: ['priya', 'george', 'jason'],
    acceptedIds: ['priya'],
    declinedIds: ['jason'],
    photoUri: null,
  },
];

export type NewSession = Omit<StoredSession, 'id' | 'startsAt' | 'endsAt'> & {
  startsAt: Date;
  endsAt: Date;
};

type State = {
  joinedIds: Set<string>;
  declinedIds: Set<string>;
  created: StoredSession[];
  sessions: Session[];
};

// e.g. "Just you", "Alex + 2 invited"
export function invitedSummary(invited: Person[]) {
  if (invited.length === 0) return 'Just you';
  if (invited.length === 1) return `${invited[0].name} invited`;
  return `${invited[0].name} + ${invited.length - 1} invited`;
}

// "Alex is going" if anyone accepted, otherwise who's invited
function createdSummary(accepted: Person[], waiting: Person[]) {
  if (accepted.length === 0) return invitedSummary(waiting);
  if (accepted.length === 1) return `${accepted[0].name} is going`;
  return `${accepted[0].name} + ${accepted.length - 1} going`;
}

// Turn ids back into people, skipping any that don't exist
function people(ids: string[] = []) {
  return ids.map((id) => findPerson(id)).filter((person) => person !== undefined);
}

function fromStored(stored: StoredSession): Session {
  const answered = new Set([...(stored.acceptedIds ?? []), ...(stored.declinedIds ?? [])]);
  const accepted = people(stored.acceptedIds);
  const invited = people(stored.invitedIds.filter((id) => !answered.has(id)));
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
    coordinates: stored.coordinates,
    description: stored.description,
    creator: CURRENT_USER,
    attendees: [CURRENT_USER, ...accepted],
    invited,
    declined: people(stored.declinedIds),
    attendeeSummary: createdSummary(accepted, invited),
  };
}

// Take you off the invited list once you've answered (and add you if you said yes)
function withMyResponse(session: Session, joined: boolean, declined: boolean): Session {
  if (!joined && !declined) return session;
  const invited = session.invited?.filter((person) => person.id !== CURRENT_USER.id);
  return joined
    ? { ...session, invited, attendees: [...session.attendees, CURRENT_USER] }
    : { ...session, invited };
}

function buildState(
  joinedIds: Set<string>,
  declinedIds: Set<string>,
  created: StoredSession[]
): State {
  const samples = SAMPLE_SESSIONS.map((session) =>
    withMyResponse(session, joinedIds.has(session.id), declinedIds.has(session.id))
  );
  return {
    joinedIds,
    declinedIds,
    created,
    // Created sessions first, then the samples
    sessions: [...created.map(fromStored), ...samples],
  };
}

let state = buildState(new Set(), new Set(), []);
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

function setResponses(joinedIds: Set<string>, declinedIds: Set<string>) {
  state = buildState(joinedIds, declinedIds, state.created);
  emit();
  save(JOINED_KEY, [...joinedIds]);
  save(DECLINED_KEY, [...declinedIds]);
}

function setCreated(created: StoredSession[]) {
  state = buildState(state.joinedIds, state.declinedIds, created);
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
    AsyncStorage.getItem(DECLINED_KEY),
    AsyncStorage.getItem(CREATED_KEY),
  ])
    .then(([joinedRaw, declinedRaw, createdRaw]) => {
      const ids = (raw: string | null) => parseList(raw).filter((id) => typeof id === 'string');
      const created = createdRaw ? (parseList(createdRaw) as StoredSession[]) : EXAMPLE_CREATED;
      state = buildState(new Set(ids(joinedRaw)), new Set(ids(declinedRaw)), created);
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

export function isCreator(session: Pick<Session, 'creator'>, personId = CURRENT_USER.id) {
  return session.creator.id === personId;
}

// Invited and haven't answered yet?
export function isInvited(session: Session, personId = CURRENT_USER.id) {
  return (session.invited ?? []).some((person) => person.id === personId);
}

function without(ids: Set<string>, id: string) {
  const next = new Set(ids);
  next.delete(id);
  return next;
}

// Join a session or accept an invite
export function joinSession(id: string) {
  if (state.joinedIds.has(id)) return;
  setResponses(new Set([...state.joinedIds, id]), without(state.declinedIds, id));
}

// Decline an invite
export function declineSession(id: string) {
  if (state.declinedIds.has(id)) return;
  setResponses(without(state.joinedIds, id), new Set([...state.declinedIds, id]));
}

export function leaveSession(id: string) {
  if (!state.joinedIds.has(id)) return;
  setResponses(without(state.joinedIds, id), state.declinedIds);
}

function toStored(id: string, { startsAt, endsAt, ...rest }: NewSession): StoredSession {
  return {
    ...rest,
    id,
    // JSON can't store Dates so save them as text
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  };
}

// Saves a new session and returns its id
export function createSession(input: NewSession) {
  const id = `created-${Date.now()}`;
  setCreated([toStored(id, input), ...state.created]);
  return id;
}

// Update a session you made, keeping replies from people still invited
export function updateSession(id: string, input: NewSession) {
  const stillInvited = (ids?: string[]) => ids?.filter((x) => input.invitedIds.includes(x));
  setCreated(
    state.created.map((session) =>
      session.id === id
        ? {
            ...toStored(id, input),
            acceptedIds: stillInvited(session.acceptedIds),
            declinedIds: stillInvited(session.declinedIds),
          }
        : session
    )
  );
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
  const invited = sessions.filter((s) => isInvited(s) && s.endsAt >= now);
  return { going, invited, created, history };
}
