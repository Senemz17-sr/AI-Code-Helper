/**
 * Course Hook - Manage course state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import type { CourseUser } from "@/types/course";
import {
  enrollCourse,
  completeLesson,
  completeCourse,
  upgradeToPremium,
} from "../logic/accessControl";

const STORAGE_KEY = "coursetutor_user_state";

const DEFAULT_USER: CourseUser = {
  id: "user_001",
  name: "Guest User",
  email: "guest@example.com",
  role: "free",
  tier: "student",
  enrolledCourses: [],
  completedLessons: [],
  completedCourses: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Hook to manage user course state with localStorage
 */
export function useUserProgress() {
  const [user, setUser] = useState<CourseUser>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  // Load user state from localStorage on mount
  useEffect(() => {
    const loadUserState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserState();
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user, isLoading]);

  const handleEnrollCourse = useCallback((courseId: string) => {
    setUser((prevUser) => enrollCourse(prevUser, courseId));
  }, []);

  const handleCompleteLesson = useCallback((lessonId: string) => {
    setUser((prevUser) => completeLesson(prevUser, lessonId));
  }, []);

  const handleCompleteCourse = useCallback((courseId: string) => {
    setUser((prevUser) => completeCourse(prevUser, courseId));
  }, []);

  const handleUpgradeToPremium = useCallback(() => {
    setUser((prevUser) => upgradeToPremium(prevUser));
  }, []);

  const handleUpdateUser = useCallback((updates: Partial<CourseUser>) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleResetUser = useCallback(() => {
    setUser(DEFAULT_USER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user,
    isLoading,
    enrollCourse: handleEnrollCourse,
    completeLesson: handleCompleteLesson,
    completeCourse: handleCompleteCourse,
    upgradeToPremium: handleUpgradeToPremium,
    updateUser: handleUpdateUser,
    resetUser: handleResetUser,
  };
}

/**
 * Hook to get computed values from user data
 */
export function useCourseStats(
  user: CourseUser,
  totalLessons: number,
  totalCourses: number
) {
  return {
    enrollmentRate: (user.enrolledCourses.length / totalCourses) * 100,
    completionRate: (user.completedCourses.length / totalCourses) * 100,
    lessonsCompleted: user.completedLessons.length,
    lessonsRemaining: totalLessons - user.completedLessons.length,
    coursesCompleted: user.completedCourses.length,
    isPremium: user.role === "premium",
  };
}

/**
 * Hook to manage course filtering and search
 */
export function useCourseFilter(
  courses: any[],
  initialLevel?: "beginner" | "intermediate" | "advanced",
  initialPremiumOnly?: boolean
) {
  const [level, setLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "all"
  >(initialLevel || "all");
  const [premiumOnly, setPremiumOnly] = useState(initialPremiumOnly || false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = level === "all" || course.level === level;
    const matchesPremium = !premiumOnly || course.tier === "premium";
    const matchesSearch =
      searchTerm === "" ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLevel && matchesPremium && matchesSearch;
  });

  return {
    filteredCourses,
    level,
    setLevel,
    premiumOnly,
    setPremiumOnly,
    searchTerm,
    setSearchTerm,
    clearFilters: () => {
      setLevel("all");
      setPremiumOnly(false);
      setSearchTerm("");
    },
  };
}
