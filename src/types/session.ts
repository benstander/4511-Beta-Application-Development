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

export const SESSION_TYPES = ['Public', 'Solo', 'Invite-only', 'Friends-only'] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Person = {
  id: string;
  name: string;
  avatarColor: string;
  bio: string;
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
  coordinates?: Coordinates;
  description: string;
  creator: Person;
  attendees: Person[];
  invited?: Person[];
  declined?: Person[];
  type?: SessionType;
  attendeeSummary: string;
};
