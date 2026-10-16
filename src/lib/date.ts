// Latest selectable birth date: exactly 18 years ago (YYYY-MM-DD).
export function getMaxDob(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
}

export function toDateInput(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

export function getAge(iso?: string | null): number | null {
  if (!iso) return null;
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return null;
  const t = new Date();
  let age = t.getUTCFullYear() - dob.getUTCFullYear();
  const m = t.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && t.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

// The backend sends UTC datetimes without a "Z"; without it the browser
// would read them as local time and show times shifted by your timezone.
export function parseUtc(iso: string): Date {
  return new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`);
}

export function timeAgo(iso: string): string {
  const diff = (parseUtc(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "just now";
}

export function formatMonthYear(iso: string): string {
  return parseUtc(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function formatTime(iso: string): string {
  return parseUtc(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function dayKey(iso: string): string {
  const d = parseUtc(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatDayLabel(iso: string): string {
  const d = parseUtc(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}