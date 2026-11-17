const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ordinal(day: number) {
  const lastTwo = day % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

// e.g. "5th Nov"
function formatDay(date: Date) {
  return `${ordinal(date.getDate())} ${MONTHS[date.getMonth()]}`;
}

// e.g. "3pm" or "5:30am"
function formatClock(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours < 12 ? 'am' : 'pm';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0
    ? `${hour12}${suffix}`
    : `${hour12}:${String(minutes).padStart(2, '0')}${suffix}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// e.g. "5th Nov, 3pm - 5pm", or with both days if it goes past midnight
export function formatSessionTime(startsAt: Date, endsAt: Date) {
  const start = `${formatDay(startsAt)}, ${formatClock(startsAt)}`;
  const end = isSameDay(startsAt, endsAt)
    ? formatClock(endsAt)
    : `${formatDay(endsAt)}, ${formatClock(endsAt)}`;
  return `${start} - ${end}`;
}
