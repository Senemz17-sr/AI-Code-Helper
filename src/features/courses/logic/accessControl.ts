/**
 * Course Access Control Logic
 * Handles permissions for courses and lessons based on user role and progress
 */

import type { Course, EnhancedLesson, CourseUser, Lesson } from "@/types/course";

/**
 * Check if a user can access a course
 * - Beginner courses: Always accessible
 * - Intermediate courses: Accessible to all users
 * - Advanced courses: Premium only
 */
export function canAccessCourse(user: CourseUser, course: Course): boolean {
  if (!user) return false;

  // Check if user is enrolled
  const isEnrolled = user.enrolledCourses.includes(course.id);

  // Beginner courses are always accessible
  if (course.level === "beginner") {
    return true;
  }

  // Intermediate courses accessible to enrolled users
  if (course.level === "intermediate") {
    return isEnrolled;
  }

  // Advanced courses require premium or enrollment
  if (course.level === "advanced") {
    return user.role === "premium" || isEnrolled;
  }

  // Tier-based access
  if (course.tier === "free") return true;
  if (course.tier === "premium") return user.role === "premium" || isEnrolled;
  if (course.tier === "advanced") return user.role === "premium";

  return false;
}

/**
 * Check if a user can access a specific lesson
 * - Respects course access rules
 * - Checks if previous lessons are completed
 * - Handles premium lessons
 */
export function canAccessLesson(
  user: CourseUser,
  lesson: EnhancedLesson,
  allLessons: EnhancedLesson[],
  course?: Course
): boolean {
  if (!user) return false;

  // Must be able to access the course first
  if (course && !canAccessCourse(user, course)) {
    return false;
  }

  // Premium lessons require premium role
  if (lesson.isPremium && user.role !== "premium") {
    return false;
  }

  // First lesson in course is always accessible (if course is accessible)
  const lessonsByChapter = allLessons
    .filter((l) => l.courseId === lesson.courseId)
    .sort((a, b) => (a.chapter || 0) - (b.chapter || 0));

  if (lessonsByChapter.length === 0) return true;

  const firstLesson = lessonsByChapter[0];
  if (lesson.id === firstLesson.id) {
    return true;
  }

  // For subsequent lessons, check if previous lesson is completed
  const currentLessonIndex = lessonsByChapter.findIndex((l) => l.id === lesson.id);
  if (currentLessonIndex <= 0) return true;

  const previousLesson = lessonsByChapter[currentLessonIndex - 1];
  return user.completedLessons.includes(previousLesson.id);
}

/**
 * Get all accessible lessons for a user in a course
 */
export function getAccessibleLessons(
  user: CourseUser,
  lessons: EnhancedLesson[],
  course?: Course
): EnhancedLesson[] {
  return lessons.filter((lesson) => canAccessLesson(user, lesson, lessons, course));
}

/**
 * Get locked lessons for a user in a course
 */
export function getLockedLessons(
  user: CourseUser,
  lessons: EnhancedLesson[],
  course?: Course
): EnhancedLesson[] {
  return lessons.filter((lesson) => !canAccessLesson(user, lesson, lessons, course));
}

/**
 * Check if a course is completed by a user
 */
export function isCourseCompleted(courseId: string, user: CourseUser): boolean {
  return user.completedCourses.includes(courseId);
}

/**
 * Get the next lesson to learn for a user in a course
 * Returns null if course is completed or user can't access course
 */
export function getNextLesson(
  courseId: string,
  user: CourseUser,
  lessons: EnhancedLesson[],
  course?: Course
): EnhancedLesson | null {
  if (isCourseCompleted(courseId, user)) {
    return null;
  }

  const courseLessons = lessons
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => (a.chapter || 0) - (b.chapter || 0));

  // Find first incomplete lesson that user can access
  for (const lesson of courseLessons) {
    if (
      canAccessLesson(user, lesson, lessons, course) &&
      !user.completedLessons.includes(lesson.id)
    ) {
      return lesson;
    }
  }

  return null;
}

/**
 * Get course progress percentage
 */
export function getCourseProgress(
  courseId: string,
  user: CourseUser,
  lessons: EnhancedLesson[]
): number {
  const courseLessons = lessons.filter((l) => l.courseId === courseId);
  if (courseLessons.length === 0) return 0;

  const completed = courseLessons.filter((l) =>
    user.completedLessons.includes(l.id)
  ).length;

  return Math.round((completed / courseLessons.length) * 100);
}

/**
 * Determine if a lesson should show a lock icon
 */
export function shouldLockLesson(
  lesson: EnhancedLesson,
  user: CourseUser,
  allLessons: EnhancedLesson[],
  course?: Course
): boolean {
  return !canAccessLesson(user, lesson, allLessons, course);
}

/**
 * Get reason why lesson is locked (for UI messaging)
 */
export function getLockReason(
  lesson: EnhancedLesson,
  user: CourseUser,
  allLessons: EnhancedLesson[],
  course?: Course
): string | null {
  if (canAccessLesson(user, lesson, allLessons, course)) {
    return null;
  }

  // Check if course access is blocked
  if (course && !canAccessCourse(user, course)) {
    return "You don't have access to this course";
  }

  // Check if premium required
  if (lesson.isPremium && user.role !== "premium") {
    return "Upgrade to Premium to access this lesson";
  }

  // Check if previous lesson not completed
  const lessonsByChapter = allLessons
    .filter((l) => l.courseId === lesson.courseId)
    .sort((a, b) => (a.chapter || 0) - (b.chapter || 0));

  const currentIndex = lessonsByChapter.findIndex((l) => l.id === lesson.id);
  if (currentIndex > 0) {
    const previousLesson = lessonsByChapter[currentIndex - 1];
    if (!user.completedLessons.includes(previousLesson.id)) {
      return `Complete "${previousLesson.title}" first`;
    }
  }

  return "This lesson is locked";
}

/**
 * Upgrade user to premium
 */
export function upgradeToPremium(user: CourseUser): CourseUser {
  return {
    ...user,
    role: "premium",
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Enroll user in a course
 */
export function enrollCourse(user: CourseUser, courseId: string): CourseUser {
  if (user.enrolledCourses.includes(courseId)) {
    return user; // Already enrolled
  }

  return {
    ...user,
    enrolledCourses: [...user.enrolledCourses, courseId],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Mark a lesson as completed
 */
export function completeLesson(user: CourseUser, lessonId: string): CourseUser {
  if (user.completedLessons.includes(lessonId)) {
    return user; // Already completed
  }

  return {
    ...user,
    completedLessons: [...user.completedLessons, lessonId],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Mark a course as completed
 */
export function completeCourse(user: CourseUser, courseId: string): CourseUser {
  if (user.completedCourses.includes(courseId)) {
    return user; // Already completed
  }

  return {
    ...user,
    completedCourses: [...user.completedCourses, courseId],
    updatedAt: new Date().toISOString(),
  };
}
