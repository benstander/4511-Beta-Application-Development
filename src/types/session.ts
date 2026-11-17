import type { ImageSource } from 'expo-image';

import type { SessionLevel } from '@/constants/theme';

export const SPORTS = [
  'Gym',
  'Running',
  'Soccer',
  'Basketball',
  'Tennis',
  'Swimming',
  'Cycling',
  'Climbing',
] as const;

export type Sport = (typeof SPORTS)[number];

export type Person = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  title: string;
  sport: Sport;
  level: SessionLevel;
  image?: ImageSource | number;
  startsAt: Date;
  endsAt: Date;
  location: string;
  description: string;
  creator: Person;
  attendees: Person[];
  attendeeSummary: string;
};
