// src/contexts/AuthContext.tsx - Authentication context for managing auth state

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthSession } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: authSession } } = await supabase.auth.getSession();
        
        if (authSession?.user) {
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("username")
            .eq("user_id", authSession.user.id)
            .single();

          const currentUser: User = {
            id: authSession.user.id,
            email: authSession.user.email || "",
            username: profileData?.username || "User",
            role: "student",
            createdAt: authSession.user.created_at || new Date().toISOString(),
            updatedAt: authSession.user.updated_at || new Date().toISOString(),
          };

          setUser(currentUser);
          setSession({
            user: currentUser,
            tokens: {
              accessToken: authSession.access_token,
              refreshToken: authSession.refresh_token || "",
              expiresIn: authSession.expires_in || 3600,
            },
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (newSession?.user) {
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("username")
            .eq("user_id", newSession.user.id)
            .single();

          const updatedUser: User = {
            id: newSession.user.id,
            email: newSession.user.email || "",
            username: profileData?.username || "User",
            role: "student",
            createdAt: newSession.user.created_at || new Date().toISOString(),
            updatedAt: newSession.user.updated_at || new Date().toISOString(),
          };

          setUser(updatedUser);
          setSession({
            user: updatedUser,
            tokens: {
              accessToken: newSession.access_token,
              refreshToken: newSession.refresh_token || "",
              expiresIn: newSession.expires_in || 3600,
            },
            isAuthenticated: true,
          });
        } else {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user || !data.session) throw new Error("Login failed");

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("user_id", data.user.id)
        .single();

      const currentUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        username: profileData?.username || "User",
        role: "student",
        createdAt: data.user.created_at || new Date().toISOString(),
        updatedAt: data.user.updated_at || new Date().toISOString(),
      };

      setUser(currentUser);
      setSession({
        user: currentUser,
        tokens: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token || "",
          expiresIn: data.session.expires_in || 3600,
        },
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Signup failed");

      // Create user profile
      await supabase.from("user_profiles").insert({
        user_id: authData.user.id,
        username,
        xp_points: 0,
        level: 1,
        learning_streak: 0,
      });

      const currentUser: User = {
        id: authData.user.id,
        email: authData.user.email || "",
        username,
        role: "student",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(currentUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      setUser(null);
      setSession(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: Record<string, any>) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);

      // Update local state
      if (updates.username) {
        setUser({ ...user, username: updates.username });
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
