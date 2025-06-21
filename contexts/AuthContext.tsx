"use client";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata?: any
  ) => Promise<{ error: any }>;
  signInWithGitHub: () => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  // Track component mount state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setIsAuthenticated(!!data.user);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && isMounted) {
        toast({
          description: "Login berhasil! Selamat datang kembali.",
          variant: "default",
        });
      } else if (error && isMounted) {
        toast({
          description: "Gagal login: " + error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (err: any) {
      if (isMounted) {
        toast({
          description: "Terjadi kesalahan: " + err.message,
          variant: "destructive",
        });
      }
      return { error: err };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (!error && isMounted) {
        toast({
          description: "Pendaftaran berhasil! Silakan cek email Anda.",
          variant: "default",
        });
      } else if (error && isMounted) {
        toast({
          description: "Gagal mendaftar: " + error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (err: any) {
      if (isMounted) {
        toast({
          description: "Terjadi kesalahan: " + err.message,
          variant: "destructive",
        });
      }
      return { error: err };
    }
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      return { error };
    } catch (err: any) {
      if (isMounted) {
        toast({
          description: "Terjadi kesalahan: " + err.message,
          variant: "destructive",
        });
      }
      return { error: err };
    }
  };

  useEffect(() => {
    // Set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Perform logout without showing toasts during the critical logout process
      const { error } = await supabase.auth.signOut();

      // Only show error toast if there's an actual error and component is mounted
      if (error && isMounted) {
        console.error('Logout error:', error);
        toast({
          description: "Error during logout: " + error.message,
          variant: "destructive",
        });
      }

      // Don't show success toast - the auth state change will handle the redirect
      // This prevents DOM manipulation errors when the page is transitioning

    } catch (err: any) {
      console.error('Unexpected logout error:', err);
      // Only show error toast if component is still mounted
      if (isMounted) {
        toast({
          description: "Unexpected error during logout",
          variant: "destructive",
        });
      }
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    refreshUser,
    signIn,
    signUp,
    signInWithGitHub,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
