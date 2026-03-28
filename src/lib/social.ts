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

  const study = driver.major === currentUser.major ? driver.major : null;

  const sharedInterest =
    driver.interests.find((i) => currentUser.interests.includes(i)) ?? null;

  const sharedClub =
    driver.clubs.find((c) => currentUser.clubs.includes(c)) ?? null;

  // Explicit templates for all 7 non-empty combinations — no ambiguous verb assembly
  if (study && sharedInterest && sharedClub)
    return `You both study ${study}, like ${sharedInterest}, and are in ${sharedClub}`;
  if (study && sharedInterest)
    return `You both study ${study} and like ${sharedInterest}`;
  if (study && sharedClub)
    return `You both study ${study} and are in ${sharedClub}`;
  if (sharedInterest && sharedClub)
    return `You both like ${sharedInterest} and are in ${sharedClub}`;
  if (study)
    return `You both study ${study}`;
  if (sharedInterest)
    return `You both like ${sharedInterest}`;
  if (sharedClub)
    return `You're both in ${sharedClub}`;

  return null;
}
