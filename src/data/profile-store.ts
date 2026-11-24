import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { CURRENT_USER } from '@/data/people';
import type { Person } from '@/types/session';

// Your name and bio. Saved so changes stay after closing the app

const PROFILE_KEY = 'beta-app/profile';

export type ProfileDetails = Pick<Person, 'name' | 'bio'>;

let me: Person = CURRENT_USER;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setMe(next: Person) {
  me = next;
  listeners.forEach((listener) => listener());
}

// Load saved changes when the app starts
export function hydrateProfile() {
  AsyncStorage.getItem(PROFILE_KEY)
    .then((raw) => {
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<ProfileDetails>;
      setMe({
        ...CURRENT_USER,
        name: typeof saved.name === 'string' ? saved.name : CURRENT_USER.name,
        bio: typeof saved.bio === 'string' ? saved.bio : CURRENT_USER.bio,
      });
    })
    .catch((error) => console.warn('Could not load profile', error));
}

export function useCurrentUser() {
  return useSyncExternalStore(
    subscribe,
    () => me,
    () => me
  );
}

export function updateProfile(details: ProfileDetails) {
  setMe({ ...me, ...details });
  AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(details)).catch((error) =>
    console.warn('Could not save profile', error)
  );
}
