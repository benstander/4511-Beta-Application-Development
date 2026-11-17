import type { Person } from '@/types/session';

export const CURRENT_USER: Person = { id: 'ben', name: 'Ben' };

export const PEOPLE: Record<string, Person> = {
  jason: { id: 'jason', name: 'Jason' },
  george: { id: 'george', name: 'George' },
  alex: { id: 'alex', name: 'Alex' },
  john: { id: 'john', name: 'John' },
  james: { id: 'james', name: 'James' },
  carter: { id: 'carter', name: 'Carter' },
  sarah: { id: 'sarah', name: 'Sarah' },
  priya: { id: 'priya', name: 'Priya' },
};

export const FRIENDS: Person[] = [
  PEOPLE.alex,
  PEOPLE.john,
  PEOPLE.james,
  PEOPLE.carter,
  PEOPLE.george,
  PEOPLE.jason,
  PEOPLE.priya,
  PEOPLE.sarah,
];

export function findFriend(id: string) {
  return FRIENDS.find((person) => person.id === id);
}
