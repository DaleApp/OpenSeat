import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  department: string;
  neighborhood: string;
  bio?: string;
  interests: string[];

  car?: Car;

  stats: UserStats;
  badges: Badge[];
  connections: string[];

  createdAt: Timestamp;
}

export interface Car {
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
  averageBuenaOnda: number;
  totalRatings: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Timestamp;
}
