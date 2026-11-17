import { PEOPLE } from '@/data/people';
import { SPORTS, type Session } from '@/types/session';

// Fake sessions for now. The first 3 are from the home screen design

export const SESSION_CATEGORIES = ['All', ...SPORTS] as const;

export type SessionCategory = (typeof SESSION_CATEGORIES)[number];

const IMAGES = {
  gym: require('@/assets/images/sessions/gym.jpg'),
  running: require('@/assets/images/sessions/running.jpg'),
  soccer: require('@/assets/images/sessions/soccer.jpg'),
  basketball: require('@/assets/images/sessions/basketball.jpg'),
  tennis: require('@/assets/images/sessions/tennis.jpg'),
  swimming: require('@/assets/images/sessions/swimming.jpg'),
  cycling: require('@/assets/images/sessions/cycling.jpg'),
  climbing: require('@/assets/images/sessions/climbing.jpg'),
};

export const SAMPLE_SESSIONS: Session[] = [
  // --- From the home screen design ---
  {
    id: 'soccer-game',
    title: 'Soccer game',
    sport: 'Soccer',
    level: 'social',
    image: IMAGES.soccer,
    startsAt: new Date(2027, 10, 5, 15, 0),
    endsAt: new Date(2027, 10, 5, 17, 0),
    location: 'Fred Caterson, Castle Hill',
    description:
      "Casual kick-around at Fred Caterson this weekend. All skill levels welcome, we'll split into even teams and swap around. Bring water and boots if you have them.",
    creator: PEOPLE.george,
    attendees: [PEOPLE.george, PEOPLE.sarah, PEOPLE.priya],
    attendeeSummary: '2 friends',
  },
  {
    id: 'gym-session',
    title: 'Gym session',
    sport: 'Gym',
    level: 'competitive',
    image: IMAGES.gym,
    startsAt: new Date(2027, 10, 7, 8, 0),
    endsAt: new Date(2027, 10, 7, 10, 0),
    location: 'Fitness First, Kellyville',
    description:
      "Who's keen for a gym session together this week? It'll be way more fun with the crew, and we'll push each other further than we ever would solo. Come along, we'll smash a workout, have a laugh, and grab food after.",
    creator: PEOPLE.jason,
    attendees: [PEOPLE.jason, PEOPLE.george, PEOPLE.alex, PEOPLE.john],
    attendeeSummary: 'John is going',
  },
  {
    id: '5km-run',
    title: '5km run',
    sport: 'Running',
    level: 'beginner',
    image: IMAGES.running,
    startsAt: new Date(2027, 10, 6, 5, 0),
    endsAt: new Date(2027, 10, 6, 5, 30),
    location: 'Samantha riley dr, Kellyville',
    description:
      'Easy-paced 5km before work. We stick together the whole way, so it is perfect if you are just getting into running. Coffee afterwards for anyone keen.',
    creator: PEOPLE.john,
    attendees: [PEOPLE.john, PEOPLE.alex],
    attendeeSummary: 'John + 1 going',
  },

  // --- Gym / Running / Soccer (reuse photos) ---
  {
    id: 'leg-day',
    title: 'Leg day',
    sport: 'Gym',
    level: 'beginner',
    image: IMAGES.gym,
    startsAt: new Date(2027, 10, 12, 18, 0),
    endsAt: new Date(2027, 10, 12, 19, 30),
    location: 'Anytime Fitness, Baulkham Hills',
    description:
      "First time doing a proper leg day? Same. We'll go through squats, lunges and deadlifts with light weights and focus on form. No pressure, just good company.",
    creator: PEOPLE.alex,
    attendees: [PEOPLE.alex, PEOPLE.priya],
    attendeeSummary: 'Alex is going',
  },
  {
    id: 'saturday-parkrun',
    title: 'Saturday parkrun',
    sport: 'Running',
    level: 'social',
    image: IMAGES.running,
    startsAt: new Date(2027, 10, 13, 7, 0),
    endsAt: new Date(2027, 10, 13, 8, 0),
    location: 'Bella Vista Farm Park, Bella Vista',
    description:
      'Weekly 5km parkrun. Run, jog or walk it, everyone finishes together at the end. Breakfast at the cafe across the road afterwards.',
    creator: PEOPLE.sarah,
    attendees: [PEOPLE.sarah, PEOPLE.george, PEOPLE.john],
    attendeeSummary: 'John + 2 going',
  },
  {
    id: 'futsal',
    title: '5-a-side futsal',
    sport: 'Soccer',
    level: 'competitive',
    image: IMAGES.soccer,
    startsAt: new Date(2027, 10, 10, 19, 0),
    endsAt: new Date(2027, 10, 10, 20, 0),
    location: 'Castle Hill Indoor Sports, Castle Hill',
    description:
      'Fast-paced indoor 5-a-side. We need one more to fill the team for the league game, so come ready to run. Indoor shoes only.',
    creator: PEOPLE.john,
    attendees: [PEOPLE.john, PEOPLE.jason, PEOPLE.alex, PEOPLE.george],
    attendeeSummary: '3 friends',
  },

  // --- Basketball ---
  {
    id: 'pickup-basketball',
    title: 'Pick-up basketball',
    sport: 'Basketball',
    level: 'social',
    image: IMAGES.basketball,
    startsAt: new Date(2027, 10, 8, 17, 0),
    endsAt: new Date(2027, 10, 8, 18, 30),
    location: 'Kellyville Park courts, Kellyville',
    description:
      "Casual half-court games after work. We'll rotate teams so everyone gets plenty of court time. Bring a ball if you have one.",
    creator: PEOPLE.jason,
    attendees: [PEOPLE.jason, PEOPLE.john],
    attendeeSummary: 'John is going',
  },
  {
    id: '3x3-tournament',
    title: '3x3 tournament',
    sport: 'Basketball',
    level: 'competitive',
    image: IMAGES.basketball,
    startsAt: new Date(2027, 10, 20, 10, 0),
    endsAt: new Date(2027, 10, 20, 13, 0),
    location: 'Hills Basketball Stadium, Castle Hill',
    description:
      'Entering a team in the local 3x3 tournament. Looking for one more player who can shoot. Games are 10 minutes each, first to 21.',
    creator: PEOPLE.george,
    attendees: [PEOPLE.george, PEOPLE.alex],
    attendeeSummary: 'Alex is going',
  },

  // --- Tennis ---
  {
    id: 'doubles-tennis',
    title: 'Doubles tennis',
    sport: 'Tennis',
    level: 'social',
    image: IMAGES.tennis,
    startsAt: new Date(2027, 10, 9, 16, 0),
    endsAt: new Date(2027, 10, 9, 18, 0),
    location: 'Castle Hill Tennis Club, Castle Hill',
    description:
      "Friendly doubles on two booked courts. We'll mix up partners every set. Racquets available to borrow if you don't have one.",
    creator: PEOPLE.priya,
    attendees: [PEOPLE.priya, PEOPLE.sarah],
    attendeeSummary: 'Sarah is going',
  },
  {
    id: 'beginner-tennis',
    title: 'Beginner tennis hit',
    sport: 'Tennis',
    level: 'beginner',
    image: IMAGES.tennis,
    startsAt: new Date(2027, 10, 14, 9, 0),
    endsAt: new Date(2027, 10, 14, 10, 30),
    location: 'Bella Vista Tennis Courts, Bella Vista',
    description:
      "Never played before? Perfect. We'll practise forehands, backhands and serves before a few relaxed games.",
    creator: PEOPLE.alex,
    attendees: [PEOPLE.alex],
    attendeeSummary: 'Alex is going',
  },

  // --- Swimming ---
  {
    id: 'morning-laps',
    title: 'Morning laps',
    sport: 'Swimming',
    level: 'beginner',
    image: IMAGES.swimming,
    startsAt: new Date(2027, 10, 11, 6, 0),
    endsAt: new Date(2027, 10, 11, 7, 0),
    location: 'Hills Aquatic Centre, Baulkham Hills',
    description:
      "Steady laps in the slow lane before work. Swim at your own pace, we'll meet in the cafe for a coffee after.",
    creator: PEOPLE.sarah,
    attendees: [PEOPLE.sarah, PEOPLE.priya],
    attendeeSummary: '2 friends',
  },
  {
    id: 'ocean-swim',
    title: 'Ocean swim',
    sport: 'Swimming',
    level: 'competitive',
    image: IMAGES.swimming,
    startsAt: new Date(2027, 10, 21, 7, 0),
    endsAt: new Date(2027, 10, 21, 8, 30),
    location: 'Manly Beach, Manly',
    description:
      'Shelly Beach to Manly and back, about 2km. Strong swimmers only, and we always swim in a group. Wetsuits recommended.',
    creator: PEOPLE.john,
    attendees: [PEOPLE.john, PEOPLE.jason, PEOPLE.george],
    attendeeSummary: 'John + 2 going',
  },

  // --- Cycling ---
  {
    id: 'sunday-road-ride',
    title: 'Sunday road ride',
    sport: 'Cycling',
    level: 'competitive',
    image: IMAGES.cycling,
    startsAt: new Date(2027, 10, 15, 6, 0),
    endsAt: new Date(2027, 10, 15, 9, 0),
    location: 'Old Windsor Rd, Kellyville',
    description:
      "60km loop out to Windsor and back at a solid pace. We'll regroup at the top of each climb. Road bike and helmet required.",
    creator: PEOPLE.george,
    attendees: [PEOPLE.george, PEOPLE.alex, PEOPLE.jason],
    attendeeSummary: '2 friends',
  },
  {
    id: 'cafe-ride',
    title: 'Cafe ride',
    sport: 'Cycling',
    level: 'social',
    image: IMAGES.cycling,
    startsAt: new Date(2027, 10, 22, 8, 0),
    endsAt: new Date(2027, 10, 22, 10, 0),
    location: 'Parramatta Park, Parramatta',
    description:
      'Easy 20km ride along the river with a long stop for coffee and pastries. Any bike is fine.',
    creator: PEOPLE.priya,
    attendees: [PEOPLE.priya, PEOPLE.sarah, PEOPLE.john],
    attendeeSummary: 'John + 1 going',
  },

  // --- Climbing ---
  {
    id: 'bouldering-night',
    title: 'Bouldering night',
    sport: 'Climbing',
    level: 'social',
    image: IMAGES.climbing,
    startsAt: new Date(2027, 10, 18, 18, 0),
    endsAt: new Date(2027, 10, 18, 20, 0),
    location: 'Hills Bouldering, Castle Hill',
    description:
      "Indoor bouldering with the crew. We'll work through problems together and cheer each other on. Shoe hire available at the front desk.",
    creator: PEOPLE.alex,
    attendees: [PEOPLE.alex, PEOPLE.jason, PEOPLE.george, PEOPLE.john],
    attendeeSummary: '3 friends',
  },
];
