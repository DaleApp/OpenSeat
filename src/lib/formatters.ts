export const VIBE_OPTIONS: { key: string; label: string }[] = [
  { key: "music_lover", label: "Music lover" },
  { key: "chatty", label: "Chatty" },
  { key: "chill", label: "Chill" },
  { key: "study_mode", label: "Study mode" },
  { key: "podcast_listener", label: "Podcast listener" },
  { key: "sing_along", label: "Sing-along" },
];

export const VIBE_LABELS: Record<string, string> = Object.fromEntries(
  VIBE_OPTIONS.map((v) => [v.key, v.label])
);

/**
 * Formats an "HH:MM" time string to "H:MM AM/PM".
 * Used by EventCard (event.time) and RideCard (extracted from ISO datetime).
 */
export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Formats two ISO datetime strings ("YYYY-MM-DDTHH:MM") into a time range.
 * e.g. "8:00 AM – 8:30 AM"
 */
export function formatTimeRange(start: string, end: string): string {
  const extractTime = (iso: string) => iso.split("T")[1] ?? "00:00";
  return `${formatTime(extractTime(start))} – ${formatTime(extractTime(end))}`;
}

/**
 * Formats a "YYYY-MM-DD" date string to a readable local date.
 * Parses as local time to avoid UTC offset shifting the day.
 * e.g. "Fri, Apr 10"
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
