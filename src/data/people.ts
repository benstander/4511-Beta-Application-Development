import type { Person } from '@/types/session';

export const CURRENT_USER: Person = { id: 'ben', name: 'Ben' };

export const PEOPLE: Record<string, Person> = {
  jason: { id: 'jason', name: 'Jason' },
  george: { id: 'george', name: 'George' },
  alex: { id: 'alex', name: 'Alex' },
  john: { id: 'john', name: 'John' },
  sarah: { id: 'sarah', name: 'Sarah' },
  priya: { id: 'priya', name: 'Priya' },
};
