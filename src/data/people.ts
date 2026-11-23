import type { Person } from '@/types/session';

// Avatar colours were picked randomly once

export const CURRENT_USER: Person = {
  id: 'ben',
  name: 'Ben',
  avatarColor: '#E7466E',
  bio: 'Weekend runner, casual baller, always keen for a game',
};

export const PEOPLE: Record<string, Person> = {
  jason: {
    id: 'jason',
    name: 'Jason',
    avatarColor: '#E1C547',
    bio: 'Gym five days a week, chasing a 200kg deadlift',
  },
  george: {
    id: 'george',
    name: 'George',
    avatarColor: '#5132DC',
    bio: 'Sunday league striker, still waiting on my first hat-trick',
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    avatarColor: '#2EE32B',
    bio: 'Early morning runs and too much coffee',
  },
  john: {
    id: 'john',
    name: 'John',
    avatarColor: '#D65D29',
    bio: 'Basketball nut, happy to play any position',
  },
  james: {
    id: 'james',
    name: 'James',
    avatarColor: '#2BB3E9',
    bio: 'Ocean swimmer, training for my first triathlon',
  },
  carter: {
    id: 'carter',
    name: 'Carter',
    avatarColor: '#B455DD',
    bio: 'Climbing most nights, bouldering on weekends',
  },
  sarah: {
    id: 'sarah',
    name: 'Sarah',
    avatarColor: '#55E28B',
    bio: 'Tennis lover looking for a regular hitting partner',
  },
  priya: {
    id: 'priya',
    name: 'Priya',
    avatarColor: '#EE4471',
    bio: 'Cyclist by day, yoga by night',
  },
};

const OTHER_USERS: Person[] = (
  [
    ['Mia', '#E67B1E', 'Netball defender, always up for a social game'],
    ['Liam', '#6433E1', 'Marathon in training, slow and steady'],
    ['Olivia', '#B036CE', 'Pilates and long walks with my dog'],
    ['Noah', '#5A60DD', 'Five-a-side regular, keeper when needed'],
    ['Emma', '#D319EB', 'New to running and loving it'],
    ['Lucas', '#D75077', 'Weekend surfer, weekday gym rat'],
    ['Chloe', '#D638AF', 'Social tennis and post-match brunch'],
    ['Ethan', '#39D570', 'Mountain biker, happiest on a trail'],
    ['Zoe', '#D1427E', 'Swim squad three mornings a week'],
    ['Ryan', '#4FC1E3', 'Pickup basketball whenever I can'],
    ['Hannah', '#CFD95E', 'Rock climber working on my first V5'],
    ['Daniel', '#EA6839', 'Cricket in summer, footy in winter'],
    ['Ava', '#DA5D2F', 'Park runs every Saturday'],
    ['Leo', '#E9E33F', 'Powerlifting and protein shakes'],
    ['Grace', '#1C1FE3', 'Touch footy and beach volleyball'],
    ['Sam', '#3C9DE7', 'Casual cyclist, coffee stop guaranteed'],
    ['Isla', '#58DA7D', 'Ex-gymnast, now into CrossFit'],
    ['Max', '#40E637', 'Futsal fanatic, any night of the week'],
    ['Ruby', '#32DCC6', 'Trail runner who loves a big hill'],
    ['Tom', '#42DF2A', 'Badminton and table tennis enthusiast'],
  ] as const
).map(([name, avatarColor, bio]) => ({ id: name.toLowerCase(), name, avatarColor, bio }));

export const USERS: Person[] = [...Object.values(PEOPLE), ...OTHER_USERS];

export const DEFAULT_FRIEND_IDS = [
  'alex',
  'john',
  'james',
  'carter',
  'george',
  'jason',
  'priya',
  'sarah',
];

export function findPerson(id: string) {
  return USERS.find((person) => person.id === id);
}
