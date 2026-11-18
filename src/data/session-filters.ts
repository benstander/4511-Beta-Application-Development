import type { SessionLevel } from '@/constants/theme';
import type { Session } from '@/types/session';
import { dateKey, formatDateKey, minutesOf } from '@/utils/date-key';

// Filters from the Filters popup. Empty means any (sport is done by the tabs)
export type SessionFilters = {
  location: string;
  level: SessionLevel | null;
  date: string | null;
  startMinutes: number | null;
  endMinutes: number | null;
};

export const EMPTY_FILTERS: SessionFilters = {
  location: '',
  level: null,
  date: null,
  startMinutes: null,
  endMinutes: null,
};

const pad = (n: number) => String(n).padStart(2, '0');

// e.g. 1050 -> "5:30pm"
export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours < 12 ? 'am' : 'pm';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return mins === 0 ? `${hour12}${suffix}` : `${hour12}:${pad(mins)}${suffix}`;
}

export function applySessionFilters(sessions: Session[], filters: SessionFilters) {
  const location = filters.location.trim().toLowerCase();
  return sessions.filter(
    (s) =>
      (location === '' || s.location.toLowerCase().includes(location)) &&
      (filters.level === null || s.level === filters.level) &&
      (filters.date === null || dateKey(s.startsAt) === filters.date) &&
      (filters.startMinutes === null || minutesOf(s.startsAt) >= filters.startMinutes) &&
      (filters.endMinutes === null || minutesOf(s.endsAt) <= filters.endMinutes)
  );
}

// How many filters are on
export function countActiveFilters(filters: SessionFilters) {
  return activeFilterPills(filters).length;
}

export function hasActiveFilters(filters: SessionFilters) {
  return countActiveFilters(filters) > 0;
}

export type FilterKey = keyof SessionFilters;

const LEVEL_LABELS: Record<SessionLevel, string> = {
  social: 'Social',
  competitive: 'Competitive',
  beginner: 'Beginner',
};

// One pill for each filter that's on
export function activeFilterPills(filters: SessionFilters): { key: FilterKey; label: string }[] {
  const pills: { key: FilterKey; label: string }[] = [];
  if (filters.location.trim()) pills.push({ key: 'location', label: filters.location.trim() });
  if (filters.level) pills.push({ key: 'level', label: LEVEL_LABELS[filters.level] });
  if (filters.date) pills.push({ key: 'date', label: formatDateKey(filters.date) });
  if (filters.startMinutes !== null)
    pills.push({ key: 'startMinutes', label: `From ${formatMinutes(filters.startMinutes)}` });
  if (filters.endMinutes !== null)
    pills.push({ key: 'endMinutes', label: `Until ${formatMinutes(filters.endMinutes)}` });
  return pills;
}

// Remove one filter
export function removeFilter(filters: SessionFilters, key: FilterKey): SessionFilters {
  return { ...filters, [key]: EMPTY_FILTERS[key] };
}
