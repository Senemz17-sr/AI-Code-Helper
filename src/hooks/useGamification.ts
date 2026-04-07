import { useState, useCallback, useEffect } from "react";
import { gamificationService } from "@/lib/api/gamification";
import { Achievement } from "@/types/gamification";

export function useGamification(userId?: string) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addXP = useCallback(
    async (amount: number) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const result = await gamificationService.addXP(userId, amount);
        setXp(result.totalXP);
        setLevel(result.newLevel);
        setError(null);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const awardBadge = useCallback(
    async (name: string, description: string, icon: string) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        await gamificationService.awardBadge(userId, name, description, icon);
        setBadges([...badges, { name, description, icon }]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, badges]
  );

  const updateStreak = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const result = await gamificationService.updateStreak(userId);
      setStreak(result.currentStreak);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const recordLessonCompletion = useCallback(
    async (lessonId: string) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        await gamificationService.recordLessonCompletion(userId, lessonId);
        addXP(100);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, addXP]
  );

  return {
    xp,
    level,
    streak,
    badges,
    isLoading,
    error,
    addXP,
    awardBadge,
    updateStreak,
    recordLessonCompletion,
  };
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (limit = 50) => {
    setIsLoading(true);
    try {
      const data = await gamificationService.getLeaderboard(limit);
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(() => fetchLeaderboard(), 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return { leaderboard, isLoading, error };
}

export function useAchievements(userId?: string) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const result = await gamificationService.getUserAchievementsProgress(userId);
        setAchievements(
          result.completed.map((id) => ({
            id,
            title: id,
            description: id,
            icon: "🎯",
            type: "course" as const,
            requirement: 0,
          }))
        );
        setProgress(result.progress);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return { achievements, progress, isLoading };
}
