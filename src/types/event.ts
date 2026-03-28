import { Timestamp } from "firebase/firestore";
import { GeoPoint } from "./user";

export interface CommunityEvent {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  location: GeoPoint;
  interestedUsers: string[];
  imageUrl?: string;
  createdAt: Timestamp;
}
