// src/lib/api/auth.ts - Backend authentication services

import { supabase } from "@/integrations/supabase/client";
import type { SignUpData, LoginData, AuthSession, User } from "@/types/auth";

/**
 * Sign up new user with email and password
 */
export async function signUp(data: SignUpData): Promise<{ user: User; sessionId: string }> {
  try {
    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("User creation failed");

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: authData.user.id,
        xp_points: 0,
        level: 1,
        learning_streak: 0,
      });

    if (profileError) throw new Error(profileError.message);

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email || "",
        username: data.username,
        role: "student",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sessionId: authData.session?.access_token || "",
    };
  } catch (error) {
    throw new Error(`Sign up failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginData): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error("Login failed");

    // Fetch user profile for additional data
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        username: profileData?.username || "User",
        role: "student",
        createdAt: data.user.created_at || new Date().toISOString(),
        updatedAt: data.user.updated_at || new Date().toISOString(),
      },
      tokens: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token || "",
        expiresIn: data.session.expires_in || 3600,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    throw new Error(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Password reset failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Password update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("user_id", data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email || "",
      username: profileData?.username || "User",
      role: "student",
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<void> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Email verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Login with OAuth provider
 */
export async function loginWithOAuth(provider: "google" | "github"): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`OAuth login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Record<string, any>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select();

    if (error) throw new Error(error.message);

    const user = await getCurrentUser();
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    throw new Error(`Profile update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
