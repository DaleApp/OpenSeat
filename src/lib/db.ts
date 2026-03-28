import { Ride, RideFilters, User, CommunityEvent } from "@/types";
import { MOCK_USERS, MOCK_RIDES, MOCK_EVENTS } from "./mock-data";

// =============================================================
// Hackathon: functions return mock data.
// Post-hackathon: replace implementation with Firestore queries.
// The interface (function signature + return types) does NOT change.
// =============================================================

// --- Users ---

export async function getUserById(userId: string): Promise<User | null> {
  return MOCK_USERS.find((u) => u.id === userId) ?? null;
}

/**
 * Batch-fetches multiple users by ID in a single pass.
 * Use this instead of calling getUserById() in a loop to avoid N+1 queries.
 * Post-hackathon: replace with a Firestore `where('__name__', 'in', ids)` query.
 */
export async function getUsersByIds(ids: string[]): Promise<User[]> {
  return MOCK_USERS.filter((u) => ids.includes(u.id));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return MOCK_USERS.find((u) => u.email === email) ?? null;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const index = MOCK_USERS.findIndex((u) => u.id === userId);
  if (index !== -1) {
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
  }
}

export async function getConnections(userId: string): Promise<User[]> {
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return [];
  return MOCK_USERS.filter((u) => user.connections.includes(u.id));
}

// --- Rides ---

export async function getRides(filters: RideFilters): Promise<Ride[]> {
  let rides = [...MOCK_RIDES];

  if (filters.date) {
    rides = rides.filter((r) => r.departureTimeStart.startsWith(filters.date!));
  }

  if (filters.destination) {
    const dest = filters.destination.toLowerCase();
    rides = rides.filter((r) =>
      r.destination.address.toLowerCase().includes(dest)
    );
  }

  if (filters.timeFrom) {
    rides = rides.filter((r) => r.departureTimeStart.slice(11, 16) >= filters.timeFrom!);
  }

  if (filters.timeTo) {
    rides = rides.filter((r) => r.departureTimeStart.slice(11, 16) <= filters.timeTo!);
  }

  rides = rides.filter((r) => r.status === "active" && r.availableSeats > 0);

  return rides;
}

export async function getRideById(rideId: string): Promise<Ride | null> {
  return MOCK_RIDES.find((r) => r.id === rideId) ?? null;
}

export async function getUserRides(userId: string): Promise<Ride[]> {
  return MOCK_RIDES.filter(
    (r) =>
      r.driverId === userId ||
      r.passengers.some((p) => p.userId === userId && p.status === "accepted")
  );
}

export async function createRide(data: Omit<Ride, "id" | "createdAt">): Promise<string> {
  const id = `ride${MOCK_RIDES.length + 1}`;
  const { Timestamp } = await import("firebase/firestore");
  const ride: Ride = { ...data, id, createdAt: Timestamp.now() };
  MOCK_RIDES.push(ride);
  return id;
}

export async function requestRide(
  rideId: string,
  passenger: Ride["passengers"][0]
): Promise<void> {
  const ride = MOCK_RIDES.find((r) => r.id === rideId);
  if (ride) {
    ride.passengers.push(passenger);
  }
}

export async function respondToRequest(
  rideId: string,
  passengerId: string,
  accept: boolean
): Promise<void> {
  const ride = MOCK_RIDES.find((r) => r.id === rideId);
  if (!ride) return;
  const passenger = ride.passengers.find((p) => p.userId === passengerId);
  if (!passenger) return;
  const { Timestamp } = await import("firebase/firestore");
  passenger.status = accept ? "accepted" : "rejected";
  passenger.respondedAt = Timestamp.now();
  if (accept) {
    ride.availableSeats = Math.max(0, ride.availableSeats - 1);
    if (ride.availableSeats === 0) ride.status = "full";
  }
}

export async function completeRide(rideId: string): Promise<void> {
  const ride = MOCK_RIDES.find((r) => r.id === rideId);
  if (ride) ride.status = "completed";
}

export async function addRating(
  rideId: string,
  rating: Ride["ratings"][0]
): Promise<void> {
  const ride = MOCK_RIDES.find((r) => r.id === rideId);
  if (ride) ride.ratings.push(rating);
}

// --- Events ---

export async function getEvents(): Promise<CommunityEvent[]> {
  return [...MOCK_EVENTS];
}

export async function getEventById(eventId: string): Promise<CommunityEvent | null> {
  return MOCK_EVENTS.find((e) => e.id === eventId) ?? null;
}

export async function getRidesForEvent(eventId: string): Promise<Ride[]> {
  return MOCK_RIDES.filter((r) => r.eventId === eventId);
}
