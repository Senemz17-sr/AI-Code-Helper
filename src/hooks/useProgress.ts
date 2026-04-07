import { useState, useCallback, useEffect } from "react";
import {
  getProgressData,
  saveLessonProgress,
  getLessonProgress,
  enrollCourse,
  getCourseProgress,
  getUserStats,
  completeLessonQuiz,
} from "@/lib/progress";
import { COURSES, LESSONS } from "@/data/courses";
import type { UserProgress } from "@/types/course";

// Mock current user ID (in real app, would come from auth)
const MOCK_USER_ID = "user-" + (typeof window !== "undefined" ? (window as any).__userId || "demo" : "demo");

export function useProgress() {
  const [data, setData] = useState(getProgressData());

  // Refresh data from storage
  const refreshData = useCallback(() => {
    setData(getProgressData());
  }, []);

  // Save lesson progress
  const markLessonComplete = useCallback(
    (lessonId: string, score: number = 100) => {
      saveLessonProgress(MOCK_USER_ID, lessonId, true, score);
      refreshData();
    },
    [refreshData]
  );

  // Enroll in course
  const enrollInCourse = useCallback((courseId: string) => {
    enrollCourse(MOCK_USER_ID, courseId);
    refreshData();
  }, [refreshData]);

  // Get course progress percentage
  const getProgress = useCallback((courseId: string) => {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return 0;
    const lessons = LESSONS.filter((l) => l.courseId === courseId);
    return getCourseProgress(MOCK_USER_ID, courseId, lessons.length);
  }, []);

  // Get user stats
  const getStats = useCallback(() => {
    return getUserStats(MOCK_USER_ID, COURSES, LESSONS);
  }, []);

  // Check if lesson is completed
  const isLessonCompleted = useCallback((lessonId: string) => {
    const progress = getLessonProgress(MOCK_USER_ID, lessonId);
    return progress?.completed || false;
  }, []);

  // Get lesson score
  const getLessonScore = useCallback((lessonId: string) => {
    const progress = getLessonProgress(MOCK_USER_ID, lessonId);
    return progress?.score || 0;
  }, []);

  // Complete quiz
  const completeQuiz = useCallback(
    (lessonId: string, score: number) => {
      completeLessonQuiz(MOCK_USER_ID, lessonId, score);
      refreshData();
    },
    [refreshData]
  );

  // Check if course is enrolled
  const isCourseEnrolled = useCallback((courseId: string) => {
    return data.courses[courseId]?.enrolled || false;
  }, [data]);

  return {
    userId: MOCK_USER_ID,
    markLessonComplete,
    enrollInCourse,
    getProgress,
    getStats,
    isLessonCompleted,
    getLessonScore,
    completeQuiz,
    isCourseEnrolled,
    refreshData,
  };
}

// Display current user ID for development
export function useCurrentUserId() {
  return MOCK_USER_ID;
}

// Hook to sync progress across tabs/windows
export function useSyncProgress() {
  const { refreshData } = useProgress();

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "codetutor_progress") {
        refreshData();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refreshData]);
}
