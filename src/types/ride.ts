import { Timestamp } from "firebase/firestore";
import { Car, GeoPoint } from "./user";

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverPhotoUrl?: string;
  driverMajor: string;
  driverRating: number;
  driverVibe: string;
  driverCar: Car;

  origin: GeoPoint;
  destination: GeoPoint;

  departureTimeStart: string; // ISO datetime "2026-04-05T08:00"
  departureTimeEnd: string;   // ISO datetime "2026-04-05T08:30"

  totalSeats: number;
  availableSeats: number;

  pickupFlexibility: "fixed" | "flexible";
  flexibleRadiusMi?: number; // 1, 2, 5, or 10 miles

  meetingPoint?: GeoPoint;

  eventId?: string;
  eventName?: string;

  note?: string;

  status: "active" | "full" | "in_progress" | "completed" | "cancelled";

  passengers: RidePassenger[];
  ratings: EmbeddedRating[];

  createdAt: Timestamp;
}

export interface RidePassenger {
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  userMajor: string;
  status: "pending" | "accepted" | "rejected";
  pickupPreference: "pickup_me" | "i_go_to_you" | "flexible";
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
}

export interface EmbeddedRating {
  fromUserId: string;
  toUserId: string;
  stars: number;
  goodVibes: number;
  wantsToConnect: boolean;
  createdAt: Timestamp;
}

export interface RideFilters {
  destination?: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
}
