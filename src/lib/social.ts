import { User } from "@/types";

export interface DriverInfo {
  id: string;
  major: string;
  interests: string[];
  clubs: string[];
}

/**
 * Compares a driver's profile with the current user and returns a natural-language
 * social hint string, or null if there are no matches.
 *
 * Examples:
 *   "You both study Computer Science"
 *   "You both like fintech"
 *   "You're both in Entrepreneurship Club"
 *   "You both study Business Administration, like fintech, and are in Entrepreneurship Club"
 */
export function computeSocialHint(
  driver: DriverInfo,
  currentUser: User
): string | null {
  if (driver.id === currentUser.id) return null;

  const parts: string[] = [];

  if (driver.major === currentUser.major) {
    parts.push(`study ${driver.major}`);
  }

  const sharedInterests = driver.interests.filter((i) =>
    currentUser.interests.includes(i)
  );
  if (sharedInterests.length > 0) {
    parts.push(`like ${sharedInterests[0]}`);
  }

  const sharedClubs = driver.clubs.filter((c) =>
    currentUser.clubs.includes(c)
  );
  if (sharedClubs.length > 0) {
    parts.push(`are in ${sharedClubs[0]}`);
  }

  if (parts.length === 0) return null;

  // Single match — special phrasing for club-only
  if (parts.length === 1) {
    return parts[0].startsWith("are in")
      ? `You're both ${parts[0]}`
      : `You both ${parts[0]}`;
  }

  // Multiple matches: "You both study X, like Y, and are in Z"
  const last = parts[parts.length - 1];
  const rest = parts.slice(0, -1);
  return `You both ${rest.join(", ")}, and ${last}`;
}
