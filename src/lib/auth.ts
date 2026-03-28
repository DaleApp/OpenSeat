import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, hasFirebaseConfig } from "./firebase";

const ALLOWED_DOMAINS = ["unc.edu", "email.unc.edu"];

export function validateEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

export async function register(email: string, password: string) {
  if (!validateEmailDomain(email)) {
    throw new Error("This email is not from UNC Chapel Hill");
  }
  if (!hasFirebaseConfig || !auth) {
    throw new Error("Firebase is not configured. Use demo mode.");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  if (!hasFirebaseConfig || !auth) {
    throw new Error("Firebase is not configured. Use demo mode.");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  if (!hasFirebaseConfig || !auth) return;
  return firebaseSignOut(auth);
}
