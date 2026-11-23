import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { DEFAULT_FRIEND_IDS, findPerson } from '@/data/people';
import type { Person } from '@/types/session';

// Your friends list. Saved so it stays after closing the app

const FRIENDS_KEY = 'beta-app/friend-ids';

let friends = toPeople(DEFAULT_FRIEND_IDS);
const listeners = new Set<() => void>();

// Skip any ids that don't exist anymore
function toPeople(ids: string[]) {
  return ids.map((id) => findPerson(id)).filter((person) => person !== undefined);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setFriends(next: Person[]) {
  friends = next;
  listeners.forEach((listener) => listener());
  AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(next.map((person) => person.id))).catch(
    (error) => console.warn('Could not save friends', error)
  );
}

// Load saved friends when the app starts
export function hydrateFriends() {
  AsyncStorage.getItem(FRIENDS_KEY)
    .then((raw) => {
      if (!raw) return;
      const ids = JSON.parse(raw) as unknown;
      if (!Array.isArray(ids)) return;
      friends = toPeople(ids.filter((id) => typeof id === 'string'));
      listeners.forEach((listener) => listener());
    })
    .catch((error) => console.warn('Could not load friends', error));
}

export function useFriends() {
  return useSyncExternalStore(
    subscribe,
    () => friends,
    () => friends
  );
}

export function isFriend(friendList: Person[], id: string) {
  return friendList.some((person) => person.id === id);
}

// Add to the end so the first 3 in the invite list don't change
export function addFriend(id: string) {
  const person = findPerson(id);
  if (!person || isFriend(friends, id)) return;
  setFriends([...friends, person]);
}

export function removeFriend(id: string) {
  setFriends(friends.filter((person) => person.id !== id));
}
