// src/types/auth.ts - Comprehensive authentication types

export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  bio?: string;
  role: 'student' | 'admin' | 'instructor';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  isAuthenticated: boolean;
}

export interface SignUpData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  xpPoints: number;
  level: number;
  learningStreak: number;
  totalCoursesCompleted: number;
  preferredLanguage: string;
  theme: 'light' | 'dark';
  badges: Badge[];
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  content: string;
  aiSummary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAnalytics {
  id: string;
  userId: string;
  lessonId: string;
  timeSpentSeconds: number;
  quizScore: number;
  completed: boolean;
  visitedAt: string;
}

export interface Leaderboard {
  userId: string;
  username: string;
  xpPoints: number;
  level: number;
  rank: number;
}
