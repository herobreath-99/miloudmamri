import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import {
  supabase,
  isSupabaseConfigured,
  getActiveSupabaseUrl,
  getActiveSupabaseAnonKey,
  resetSupabaseClientInstance,
} from "@/integrations/supabase/client";
import {
  getProfile as getLocalProfile,
  saveProfile as saveLocalProfile,
  clearAllData,
  type LocalProfile,
} from "@/lib/local-db";

export type AuthConnectionStatus = "connected" | "connecting" | "unconfigured" | "error";

export type SignUpMetadata = {
  firstName: string;
  lastName: string;
  age?: number | null;
  avatarUrl?: string | null;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: LocalProfile | null;
  loading: boolean;
  isConfigured: boolean;
  connectionStatus: AuthConnectionStatus;
  connectionError: string | null;
  signUp: (
    email: string,
    pass: string,
    meta: SignUpMetadata,
  ) => Promise<{
    error: AuthError | Error | null;
    user: User | null;
    emailConfirmationRequired?: boolean;
  }>;
  signInWithPassword: (
    email: string,
    pass: string,
  ) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signInWithGoogle: () => Promise<{
    error: AuthError | Error | null;
    redirected?: boolean;
    popup?: boolean;
  }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<LocalProfile>) => Promise<LocalProfile>;
  refreshProfile: () => Promise<void>;
  testConnection: () => Promise<{ ok: boolean; message: string }>;
};

const AuthCtx = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  connectionStatus: "connecting",
  connectionError: null,
  signUp: async () => ({ error: new Error("Not initialized"), user: null }),
  signInWithPassword: async () => ({ error: new Error("Not initialized"), user: null }),
  signInWithGoogle: async () => ({ error: new Error("Not initialized") }),
  resetPasswordForEmail: async () => ({ error: new Error("Not initialized") }),
  signOut: async () => {},
  updateProfile: async () => ({}) as LocalProfile,
  refreshProfile: async () => {},
  testConnection: async () => ({ ok: false, message: "" }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(() => getLocalProfile());
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured());
  const [connectionStatus, setConnectionStatus] = useState<AuthConnectionStatus>("connecting");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Sync profile row from Supabase `profiles` table
  const syncProfileFromSupabase = useCallback(async (activeUser: User): Promise<LocalProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", activeUser.id)
        .maybeSingle();

      if (!error && data) {
        const merged: LocalProfile = {
          id: data.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age,
          avatar_url: data.avatar_url,
          city: null,
          journey_start: null,
          notes: null,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        saveLocalProfile(merged);
        setProfile(merged);
        return merged;
      }

      // If no profile exists yet in the table, upsert from user metadata
      const meta = activeUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || "";
      const nameParts = fullName.split(" ");
      const firstName =
        meta.first_name || nameParts[0] || activeUser.email?.split("@")[0] || "مستفيدة";
      const lastName = meta.last_name || nameParts.slice(1).join(" ") || "PinkCare";
      const avatarUrl = meta.avatar_url || meta.picture || null;
      const age = meta.age ? Number(meta.age) : null;

      const newRecord = {
        id: activeUser.id,
        email: activeUser.email || null,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        age: age,
      };

      await supabase.from("profiles").upsert(newRecord, { onConflict: "id" });

      const local = saveLocalProfile({
        id: activeUser.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        age: age,
      });
      setProfile(local);
      return local;
    } catch {
      // Fallback to local profile with user id
      const existing = getLocalProfile();
      const fallback: LocalProfile = saveLocalProfile({
        id: activeUser.id,
        first_name: existing?.first_name || activeUser.email?.split("@")[0] || "مستفيدة",
        last_name: existing?.last_name || "",
      });
      setProfile(fallback);
      return fallback;
    }
  }, []);

  // Ping Supabase Auth to verify connectivity
  const testConnection = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    if (!configured) {
      setConnectionStatus("unconfigured");
      return {
        ok: false,
        message:
          "Supabase anon key is not configured. Set VITE_SUPABASE_PUBLISHABLE_KEY or add it in settings.",
      };
    }

    try {
      const url = getActiveSupabaseUrl();
      const key = getActiveSupabaseAnonKey();
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: key },
      });

      if (res.ok || res.status === 200) {
        setConnectionStatus("connected");
        setConnectionError(null);
        return { ok: true, message: "Connected to Supabase Auth successfully." };
      } else {
        const text = await res.text().catch(() => "");
        setConnectionStatus("error");
        setConnectionError(`HTTP ${res.status}: ${text}`);
        return { ok: false, message: `Supabase returned status ${res.status}` };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setConnectionStatus("error");
      setConnectionError(msg);
      return { ok: false, message: msg };
    }
  }, []);

  // Initialize session and subscribe to onAuthStateChange
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const configured = isSupabaseConfigured();
        setIsConfigured(configured);

        if (configured) {
          testConnection();
        } else {
          setConnectionStatus("unconfigured");
        }

        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          console.warn("[PinkCare Auth] getSession error:", error.message);
        }

        if (data?.session?.user) {
          setSession(data.session);
          setUser(data.session.user);
          await syncProfileFromSupabase(data.session.user);
        } else {
          // If no active Supabase session, keep local profile if previously logged in
          const local = getLocalProfile();
          setProfile(local);
        }
      } catch (err) {
        console.warn("[PinkCare Auth] Init exception:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to real Supabase auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === "SIGNED_IN" && newSession?.user) {
        await syncProfileFromSupabase(newSession.user);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
        clearAllData();
      } else if (event === "USER_UPDATED" && newSession?.user) {
        await syncProfileFromSupabase(newSession.user);
      }
    });

    // Re-check when custom credentials are updated
    const handleReconfig = () => {
      resetSupabaseClientInstance();
      setIsConfigured(isSupabaseConfigured());
      testConnection();
    };
    window.addEventListener("pinkcare:supabase-configured", handleReconfig);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("pinkcare:supabase-configured", handleReconfig);
    };
  }, [syncProfileFromSupabase, testConnection]);

  // Sign Up with Email and Password
  const signUp = useCallback(
    async (
      email: string,
      pass: string,
      meta: SignUpMetadata,
    ): Promise<{
      error: AuthError | Error | null;
      user: User | null;
      emailConfirmationRequired?: boolean;
    }> => {
      try {
        const callbackUrl = `${window.location.origin}/auth/callback`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              first_name: meta.firstName,
              last_name: meta.lastName,
              age: meta.age,
            },
            emailRedirectTo: callbackUrl,
          },
        });

        if (error) {
          return { error, user: null };
        }

        if (data.user) {
          // If session returned immediately (email confirmation disabled or auto-confirmed)
          if (data.session) {
            setSession(data.session);
            setUser(data.user);
            await syncProfileFromSupabase(data.user);
            return { error: null, user: data.user, emailConfirmationRequired: false };
          }
          // Email confirmation is required
          return { error: null, user: data.user, emailConfirmationRequired: true };
        }

        return { error: null, user: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error(String(err)),
          user: null,
        };
      }
    },
    [syncProfileFromSupabase],
  );

  // Sign In with Email and Password
  const signInWithPassword = useCallback(
    async (
      email: string,
      pass: string,
    ): Promise<{ error: AuthError | Error | null; user: User | null }> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          return { error, user: null };
        }

        if (data.user) {
          setSession(data.session);
          setUser(data.user);
          await syncProfileFromSupabase(data.user);
          return { error: null, user: data.user };
        }

        return { error: null, user: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error(String(err)),
          user: null,
        };
      }
    },
    [syncProfileFromSupabase],
  );

  // Sign In with Google OAuth via Supabase
  const signInWithGoogle = useCallback(async (): Promise<{
    error: AuthError | Error | null;
    redirected?: boolean;
    popup?: boolean;
  }> => {
    try {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const isFramed = typeof window !== "undefined" && window.self !== window.top;

      // When running inside an iframe (like AI Studio preview), use skipBrowserRedirect: true
      // and open the OAuth URL in a dedicated popup window to bypass X-Frame-Options
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: isFramed,
        },
      });

      if (error) {
        return { error };
      }

      // If running in an iframe, open the Google consent screen in a popup
      if (isFramed && data?.url) {
        const width = 540;
        const height = 680;
        const left = Math.max(0, (window.screen.width - width) / 2);
        const top = Math.max(0, (window.screen.height - height) / 2);

        const popup = window.open(
          data.url,
          "pinkcare_google_auth",
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`,
        );

        if (!popup) {
          // Fallback to top-level navigation if popup was blocked
          window.location.href = data.url;
          return { error: null, redirected: true };
        }

        return { error: null, popup: true };
      }

      return { error: null, redirected: true };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }, []);

  // Password Recovery / Reset
  const resetPasswordForEmail = useCallback(
    async (email: string): Promise<{ error: AuthError | Error | null }> => {
      try {
        const callbackUrl = `${window.location.origin}/auth/callback?type=recovery`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: callbackUrl,
        });
        return { error };
      } catch (err) {
        return { error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
    [],
  );

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out exception:", e);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      clearAllData();
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (patch: Partial<LocalProfile>): Promise<LocalProfile> => {
      // 1. Update local database
      const updated = saveLocalProfile(patch);
      setProfile(updated);

      // 2. If signed in with Supabase, persist to `profiles` table
      if (user) {
        try {
          await supabase
            .from("profiles")
            .update({
              first_name: patch.first_name,
              last_name: patch.last_name,
              age: patch.age,
              avatar_url: patch.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        } catch (err) {
          console.warn("Failed to update profile row in Supabase:", err);
        }
      }

      return updated;
    },
    [user],
  );

  const refreshProfile = useCallback(async () => {
    if (user) {
      await syncProfileFromSupabase(user);
    } else {
      setProfile(getLocalProfile());
    }
  }, [user, syncProfileFromSupabase]);

  return (
    <AuthCtx.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        connectionStatus,
        connectionError,
        signUp,
        signInWithPassword,
        signInWithGoogle,
        resetPasswordForEmail,
        signOut,
        updateProfile,
        refreshProfile,
        testConnection,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
