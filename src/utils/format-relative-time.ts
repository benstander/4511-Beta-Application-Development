const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "Just now", "5m ago", "2d ago" etc, or the date if it's older
export function formatRelativeTime(date: Date, now = new Date()) {
  const ago = now.getTime() - date.getTime();
  if (ago < MINUTE) return 'Just now';
  if (ago < HOUR) return `${Math.floor(ago / MINUTE)}m ago`;
  if (ago < DAY) return `${Math.floor(ago / HOUR)}h ago`;
  if (ago < 7 * DAY) return `${Math.floor(ago / DAY)}d ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}
