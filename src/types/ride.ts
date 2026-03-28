import { Timestamp } from "firebase/firestore";
import { Car } from "./user";

export interface GeoPoint {
  address: string;
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverPhotoUrl?: string;
  driverDepartment: string;
  driverRating: number;
  driverCar: Car;

  origin: GeoPoint;
  destination: GeoPoint;

  date: string; // "YYYY-MM-DD"
  departureTime: string; // "HH:mm"

  totalSeats: number;
  availableSeats: number;

  pickupFlexibility: "fixed" | "flexible";
  flexibleRadiusKm?: number;

  meetingPoint?: GeoPoint;

  vibe: RideVibe;

  note?: string;

  status: "active" | "full" | "in_progress" | "completed" | "cancelled";

  passengers: RidePassenger[];
  ratings: EmbeddedRating[];

  createdAt: Timestamp;
}

export interface RideVibe {
  music: boolean;
  chat: boolean;
  quiet: boolean;
}

export interface RidePassenger {
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  userDepartment: string;
  status: "pending" | "accepted" | "rejected";
  pickupPreference: "pickup_me" | "i_go_to_you" | "flexible";
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
}

export interface EmbeddedRating {
  fromUserId: string;
  toUserId: string;
  stars: number;
  buenaOnda: number;
  wantsToConnect: boolean;
  createdAt: Timestamp;
}

export interface RideFilters {
  destination?: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
}
