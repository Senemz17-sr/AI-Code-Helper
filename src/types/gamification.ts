export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  badge_count: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  completed: boolean;
  unlockedAt?: string;
}

export interface GamificationConfig {
  xpPerLesson: number;
  xpPerQuiz: number;
  xpPerBugFound: number;
  xpPerNoteCreated: number;
  xpLevelMultiplier: number;
  streakBonusXP: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

export const DEFAULT_GAMIFICATION_CONFIG: GamificationConfig = {
  xpPerLesson: 100,
  xpPerQuiz: 50,
  xpPerBugFound: 25,
  xpPerNoteCreated: 10,
  xpLevelMultiplier: 1000,
  streakBonusXP: 50,
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "xp" | "streak" | "badge" | "course";
  requirement: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    type: "course",
    requirement: 1,
  },
  {
    id: "5-lessons",
    title: "Getting Started",
    description: "Complete 5 lessons",
    icon: "📚",
    type: "course",
    requirement: 5,
  },
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    type: "xp",
    requirement: 5,
  },
  {
    id: "perfect-quiz",
    title: "Quiz Master",
    description: "Score 100% on a quiz",
    icon: "🎓",
    type: "xp",
    requirement: 100,
  },
  {
    id: "7-day-streak",
    title: "On Fire",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    type: "streak",
    requirement: 7,
  },
  {
    id: "bug-finder",
    title: "Bug Hunter",
    description: "Find 5 bugs in code analysis",
    icon: "🐛",
    type: "xp",
    requirement: 5,
  },
  {
    id: "note-taker",
    title: "Writer",
    description: "Create 10 notes",
    icon: "✍️",
    type: "course",
    requirement: 10,
  },
];

export const BADGE_TIERS = {
  bronze: { minXP: 0, icon: "🥉", color: "from-orange-600 to-orange-400" },
  silver: { minXP: 5000, icon: "🥈", color: "from-slate-400 to-slate-300" },
  gold: { minXP: 15000, icon: "🥇", color: "from-yellow-500 to-yellow-300" },
  platinum: { minXP: 50000, icon: "💎", color: "from-purple-500 to-pink-300" },
};
