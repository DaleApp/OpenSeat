import { Ride, RideFilters, User } from "@/types";
import { MOCK_USERS, MOCK_RIDES } from "./mock-data";

// =============================================================
// Hackathon: functions return mock data.
// Post-hackathon: replace implementation with Firestore queries.
// The interface (function signature + return types) does NOT change.
// =============================================================

// --- Users ---

export async function getUser(userId: string): Promise<User | null> {
  return MOCK_USERS.find((u) => u.id === userId) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return MOCK_USERS.find((u) => u.email === email) ?? null;
}

// --- Rides ---

export async function getRides(filters: RideFilters): Promise<Ride[]> {
  let rides = [...MOCK_RIDES];

  if (filters.date) {
    rides = rides.filter((r) => r.date === filters.date);
  }

  rides = rides.filter((r) => r.status === "active" && r.availableSeats > 0);

  return rides;
}

export async function getRide(rideId: string): Promise<Ride | null> {
  return MOCK_RIDES.find((r) => r.id === rideId) ?? null;
}

export async function getUserRides(userId: string): Promise<Ride[]> {
  return MOCK_RIDES.filter(
    (r) =>
      r.driverId === userId ||
      r.passengers.some((p) => p.userId === userId && p.status === "accepted")
  );
}
