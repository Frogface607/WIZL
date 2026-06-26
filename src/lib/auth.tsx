"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { setAuthUserId } from "./store";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAnonymous: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAnonymous: true,
  isLoading: true,
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase));

  const isAnonymous = !user || user.is_anonymous === true;

  useEffect(() => {
    const sb = supabase;
    if (!sb) {
      queueMicrotask(() => {
        setIsLoading(false);
      });
      return;
    }

    // WIZL can run locally without an account. Avoid silent anonymous signups
    // when Supabase anonymous auth is disabled; magic links still work.
    sb.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setAuthUserId(currentSession.user.id);
      } else {
        setSession(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        setAuthUserId(nextSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      if (!supabase) return { error: "Supabase not configured" };

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: redirectTo },
      });

      return { error: error?.message ?? null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, isAnonymous, isLoading, signInWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
