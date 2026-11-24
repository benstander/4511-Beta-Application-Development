import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { isAttending, isCreator, useSessions } from '@/data/session-store';
import type { Person, Session } from '@/types/session';

// Notifications are made from the sessions: invites, replies to your sessions and
// reminders 1 hour before. There's no server so the times are made up below

export type NotificationKind = 'invite' | 'going' | 'declined' | 'reminder';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  session: Session;
  person?: Person;
  at: Date;
};

const SEEN_KEY = 'beta-app/notifications-seen-at';
const HOUR = 60 * 60 * 1000;

const INVITES: { sessionId: string; at: Date }[] = [
  { sessionId: 'tuesday-futsal', at: new Date(2026, 10, 14, 18, 40) },
  { sessionId: 'sunrise-parkrun', at: new Date(2026, 10, 18, 19, 12) },
  { sessionId: 'pickup-basketball', at: new Date(2026, 10, 23, 20, 5) },
  { sessionId: 'doubles-tennis', at: new Date(2026, 10, 24, 9, 30) },
];

const REPLY_TIMES: Record<string, Date> = {
  'created-example-soccer:alex': new Date(2026, 10, 22, 10, 15),
  'created-example-soccer:john': new Date(2026, 10, 22, 13, 2),
  'created-example-soccer:sarah': new Date(2026, 10, 23, 8, 47),
  'created-example-run:priya': new Date(2026, 10, 23, 18, 20),
  'created-example-run:jason': new Date(2026, 10, 24, 7, 55),
};

const FIRST_SEEN_AT = new Date(2026, 10, 23, 12, 0).getTime();

let seenAt = FIRST_SEEN_AT;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setSeenAt(next: number) {
  seenAt = next;
  listeners.forEach((listener) => listener());
}

export function hydrateNotifications() {
  AsyncStorage.getItem(SEEN_KEY)
    .then((raw) => {
      const saved = Number(raw);
      if (raw && Number.isFinite(saved)) setSeenAt(saved);
    })
    .catch((error) => console.warn('Could not load notifications', error));
}

// When you last opened Notifications
export function useNotificationsSeenAt() {
  return useSyncExternalStore(
    subscribe,
    () => seenAt,
    () => seenAt
  );
}

export function markNotificationsSeen() {
  const now = Date.now();
  setSeenAt(now);
  AsyncStorage.setItem(SEEN_KEY, String(now)).catch((error) =>
    console.warn('Could not save notifications', error)
  );
}

function buildNotifications(sessions: Session[], now: number): AppNotification[] {
  const byId = new Map(sessions.map((session) => [session.id, session]));
  const list: AppNotification[] = [];

  for (const invite of INVITES) {
    const session = byId.get(invite.sessionId);
    if (!session) continue;
    list.push({
      id: `invite:${session.id}`,
      kind: 'invite',
      session,
      person: session.creator,
      at: invite.at,
    });
  }

  for (const session of sessions) {
    if (isCreator(session)) {
      // Only the made up replies have times (so none about yourself)
      for (const person of session.attendees) {
        const at = REPLY_TIMES[`${session.id}:${person.id}`];
        if (at) {
          list.push({
            id: `going:${session.id}:${person.id}`,
            kind: 'going',
            session,
            person,
            at,
          });
        }
      }
      for (const person of session.declined ?? []) {
        const at = REPLY_TIMES[`${session.id}:${person.id}`];
        if (at) {
          list.push({
            id: `declined:${session.id}:${person.id}`,
            kind: 'declined',
            session,
            person,
            at,
          });
        }
      }
    }

    const reminderAt = session.startsAt.getTime() - HOUR;
    if (isAttending(session) && reminderAt <= now) {
      list.push({
        id: `reminder:${session.id}`,
        kind: 'reminder',
        session,
        at: new Date(reminderAt),
      });
    }
  }

  return list.filter((item) => item.at.getTime() <= now).sort((a, b) => +b.at - +a.at);
}

// Newest first
export function useNotifications(now = new Date()) {
  return buildNotifications(useSessions(), now.getTime());
}

export function useHasUnreadNotifications() {
  const seen = useNotificationsSeenAt();
  return useNotifications().some((item) => item.at.getTime() > seen);
}
