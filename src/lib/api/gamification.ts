import { supabase } from "@/integrations/supabase/client";
import { LeaderboardEntry, StreakData, DEFAULT_GAMIFICATION_CONFIG } from "@/types/gamification";

export const gamificationService = {
  // Add XP to user
  async addXP(userId: string, amount: number): Promise<{ totalXP: number; levelUp: boolean; newLevel: number }> {
    try {
      // Get current user data
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("xp, level")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const currentXP = userData.xp || 0;
      const currentLevel = userData.level || 1;
      const totalXP = currentXP + amount;

      // Calculate new level
      const xpPerLevel = DEFAULT_GAMIFICATION_CONFIG.xpLevelMultiplier;
      const newLevel = Math.floor(totalXP / xpPerLevel) + 1;
      const levelUp = newLevel > currentLevel;

      // Update user
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ xp: totalXP, level: newLevel })
        .eq("id", userId);

      if (updateError) throw updateError;

      return { totalXP, levelUp, newLevel };
    } catch (error) {
      throw new Error(
        `Failed to add XP: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Award badge to user
  async awardBadge(
    userId: string,
    badgeName: string,
    description: string,
    icon: string
  ): Promise<void> {
    try {
      // Check if user already has this badge
      const { data: existingBadge } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("name", badgeName)
        .single();

      if (existingBadge) return; // Already has badge

      // Award badge
      const { error } = await supabase
        .from("user_badges")
        .insert({
          user_id: userId,
          name: badgeName,
          description,
          icon,
          earned_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      throw new Error(
        `Failed to award badge: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar, xp, level")
        .order("xp", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Enrich with badge count and rank
      const leaderboard = await Promise.all(
        (data || []).map(async (user, index) => {
          const { count } = await supabase
            .from("user_badges")
            .select("*", { count: "exact" })
            .eq("user_id", user.id);

          return {
            user_id: user.id,
            username: user.username,
            avatar: user.avatar,
            xp: user.xp || 0,
            level: user.level || 1,
            rank: index + 1,
            badge_count: count || 0,
          } as LeaderboardEntry;
        })
      );

      return leaderboard;
    } catch (error) {
      throw new Error(
        `Failed to fetch leaderboard: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get user rank
  async getUserRank(userId: string): Promise<number> {
    try {
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("xp")
        .eq("id", userId)
        .single();

      if (!userData) throw new Error("User not found");

      const { count } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact" })
        .gt("xp", userData.xp);

      return (count || 0) + 1;
    } catch (error) {
      throw new Error(
        `Failed to get rank: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Update streak
  async updateStreak(userId: string): Promise<StreakData> {
    try {
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("streak_days, last_activity_date")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const now = new Date();
      const lastActivity = userData?.last_activity_date
        ? new Date(userData.last_activity_date)
        : null;

      let newStreak = userData?.streak_days || 0;

      if (lastActivity) {
        const daysDifference = Math.floor(
          (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference === 0) {
          // Same day, streak continues
          // Don't change streak
        } else if (daysDifference === 1) {
          // Next day, increment streak
          newStreak = (newStreak || 0) + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First activity
        newStreak = 1;
      }

      // Update user
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          streak_days: newStreak,
          last_activity_date: now.toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      return {
        currentStreak: newStreak,
        longestStreak: userData?.longest_streak || newStreak,
        lastActivityDate: now.toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Failed to update streak: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Record lesson completion
  async recordLessonCompletion(userId: string, lessonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("lesson_completions")
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        })
        .select();

      if (error && error.code !== "23505") {
        // 23505 is unique constraint violation (already completed)
        throw error;
      }

      // Add XP for lesson completion
      await this.addXP(userId, DEFAULT_GAMIFICATION_CONFIG.xpPerLesson);

      // Update streak
      await this.updateStreak(userId);
    } catch (error) {
      throw new Error(
        `Failed to record completion: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get user achievements progress
  async getUserAchievementsProgress(userId: string): Promise<{
    completed: string[];
    progress: Record<string, number>;
  }> {
    try {
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("xp, level, streak_days")
        .eq("id", userId)
        .single();

      const { data: completions } = await supabase
        .from("lesson_completions")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      const { data: badges } = await supabase
        .from("user_badges")
        .select("*");

      const completed = [];
      const progress: Record<string, number> = {};

      // Check achievements
      if (completions && completions.length >= 1) {
        completed.push("first-lesson");
        progress["5-lessons"] = Math.min(completions.length, 5);
        if (completions.length >= 5) completed.push("5-lessons");
      }

      if (userData?.level && userData.level >= 5) {
        completed.push("level-5");
      }
      progress["level-5"] = userData?.level || 0;

      if (userData?.streak_days && userData.streak_days >= 7) {
        completed.push("7-day-streak");
      }
      progress["7-day-streak"] = userData?.streak_days || 0;

      progress["bug-finder"] = 0; // To be updated with actual bug detection
      progress["note-taker"] = 0; // To be updated with note count

      return { completed, progress };
    } catch (error) {
      throw new Error(
        `Failed to get achievements: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
