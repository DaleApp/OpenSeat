"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, hasFirebaseConfig } from "./firebase";
import { getUserByEmail } from "./db";
import { User } from "@/types";
import { MOCK_USERS } from "./mock-data";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemoMode: boolean;
  switchDemoUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isDemoMode: false,
  switchDemoUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !hasFirebaseConfig;

  useEffect(() => {
    if (isDemoMode) {
      setUser(MOCK_USERS[0]);
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser?.email) {
        const appUser = await getUserByEmail(fbUser.email);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  function switchDemoUser(userId: string) {
    if (!isDemoMode) return;
    const demoUser = MOCK_USERS.find((u) => u.id === userId) ?? null;
    setUser(demoUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, isDemoMode, switchDemoUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
