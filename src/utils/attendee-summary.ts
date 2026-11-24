import { CURRENT_USER } from '@/data/people';
import type { Person } from '@/types/session';

const MAX_FACES = 3;

// Avatars and text for a session card, e.g. "Alex + 2 going".
// Other people first (friends before everyone else), or "Just you"
export function attendeeSummary(attendees: Person[], friendIds: Set<string>) {
  const others = attendees.filter((person) => person.id !== CURRENT_USER.id);
  const ordered = [
    ...others.filter((person) => friendIds.has(person.id)),
    ...others.filter((person) => !friendIds.has(person.id)),
  ];
  const youreGoing = others.length < attendees.length;

  if (ordered.length === 0) {
    return {
      faces: youreGoing ? [CURRENT_USER] : [],
      text: youreGoing ? 'Just you' : 'No one yet',
    };
  }

  const [first, ...rest] = ordered;
  return {
    faces: ordered.slice(0, MAX_FACES),
    text: rest.length === 0 ? `${first.name} is going` : `${first.name} + ${rest.length} going`,
  };
}
