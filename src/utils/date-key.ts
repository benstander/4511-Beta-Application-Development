// Helpers for dates as "YYYY-MM-DD" and times as minutes after midnight

const pad = (n: number) => String(n).padStart(2, '0');

// e.g. "2027-11-05"
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// "2027-11-05" -> Date at midnight
export function dateFromKey(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// "2027-11-05" -> "05/11/2027"
export function formatDateKey(key: string) {
  const [year, month, day] = key.split('-');
  return `${day}/${month}/${year}`;
}

// Minutes after midnight
export function minutesOf(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

// Today at that many minutes after midnight
export function dateAtMinutes(minutes: number) {
  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}
