import { Timestamp } from "firebase/firestore";

export interface GeoPoint {
  address: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  address: GeoPoint;
  major: string;
  status: "student" | "professor" | "staff" | "other";
  interests: string[];
  vibe?: string;
  clubs: string[];

  car?: Car;

  stats: UserStats;
  badges: Badge[];
  connections: string[];

  createdAt: Timestamp;
}

export interface Car {
  driversLicenseUrl: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

export interface UserStats {
  totalRides: number;
  totalKm: number;
  co2Saved: number;
  peopleConnected: number;
  averageRating: number;
  averageGoodVibes: number;
  totalRatings: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Timestamp;
}
