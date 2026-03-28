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
 * Shared date/time formatters used across multiple components.
 *
 * Canonical source — forward-ported from feat/home-page.
 * Any component that needs to display dates or times should import from here
 * instead of defining its own inline function.
 *
 * Current consumers:
 *   - EventCard (formatDate, formatTime)
 *   - EventRideList (formatTimeRange)
 *   - events/[id]/page.tsx (formatEventDateTime)
 *   - RideCard — Phase 3 (formatTimeRange)
 *   - home/page.tsx — Phase 3 (formatDate)
 */

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
 * e.g. ("2026-04-10T18:00", "2026-04-10T18:30") → "6:00 PM – 6:30 PM"
 */
export function formatTimeRange(start: string, end: string): string {
  const extractTime = (iso: string) => iso.split("T")[1] ?? "00:00";
  return `${formatTime(extractTime(start))} – ${formatTime(extractTime(end))}`;
}

/**
 * Formats a "YYYY-MM-DD" date string to a short readable date.
 * Parses as local time to avoid UTC offset shifting the day.
 * e.g. "2026-04-10" → "Fri, Apr 10"
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

/**
 * Formats a "YYYY-MM-DD" date string to a long readable date.
 * e.g. "2026-04-10" → "Friday, April 10"
 * Used in event detail pages where more space is available.
 */
export function formatDateLong(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Combines a date string and time string into a full event label.
 * e.g. ("2026-04-10", "19:00") → "Friday, April 10 · 7:00 PM"
 * Used in event detail page headers.
 */
export function formatEventDateTime(dateStr: string, timeStr: string): string {
  return `${formatDateLong(dateStr)} · ${formatTime(timeStr)}`;
}
