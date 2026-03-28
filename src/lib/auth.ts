import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Dominios permitidos (hardcodeado para hackathon, post-hackathon viene de Firestore)
const ALLOWED_DOMAINS = ["utdt.edu", "mail.utdt.edu"];

export function validateEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

export async function register(email: string, password: string) {
  if (!validateEmailDomain(email)) {
    throw new Error("Este email no pertenece a UTDT");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}
