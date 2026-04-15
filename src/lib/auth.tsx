"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
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
  const [isLoading, setIsLoading] = useState(true);

  const isAnonymous = !user || user.is_anonymous === true;

  useEffect(() => {
    const sb = supabase;
    if (!sb) {
      setIsLoading(false);
      return;
    }

    // 1. Check existing session
    sb.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        setUser(s.user);
        setAuthUserId(s.user.id);
        setIsLoading(false);
      } else {
        // 2. No session — sign in anonymously
        sb.auth.signInAnonymously().then(({ data, error }) => {
          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            setAuthUserId(data.session.user.id);
          }
          setIsLoading(false);
        });
      }
    });

    // 3. Listen for auth state changes (magic link, sign out, etc.)
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAuthUserId(s.user.id);
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
    []
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    // After sign out, create a new anonymous session
    const { data } = await supabase.auth.signInAnonymously();
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, isAnonymous, isLoading, signInWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
