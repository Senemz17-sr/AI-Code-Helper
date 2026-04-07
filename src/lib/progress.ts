import type { UserProgress, Course, Lesson } from "@/types/course";

// This is a mock implementation. In production, these would use Supabase.
const PROGRESS_STORAGE_KEY = "codetutor_progress";

export interface ProgressData {
  lessons: UserProgress[];
  courses: Record<string, { enrolled: boolean; progress: number }>;
}

// Get all progress data
export function getProgressData(): ProgressData {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : { lessons: [], courses: {} };
  } catch {
    return { lessons: [], courses: {} };
  }
}

// Save lesson progress
export function saveLessonProgress(
  userId: string,
  lessonId: string,
  completed: boolean,
  score: number = 0
): UserProgress {
  const data = getProgressData();
  const existingIdx = data.lessons.findIndex(
    (p) => p.lessonId === lessonId && p.userId === userId
  );

  const progress: UserProgress = {
    id: lessonId + "-" + userId,
    userId,
    lessonId,
    completed,
    quizPassed: score >= 70,
    score,
    completedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    data.lessons[existingIdx] = progress;
  } else {
    data.lessons.push(progress);
  }

  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  return progress;
}

// Get lesson progress
export function getLessonProgress(
  userId: string,
  lessonId: string
): UserProgress | undefined {
  const data = getProgressData();
  return data.lessons.find(
    (p) => p.lessonId === lessonId && p.userId === userId
  );
}

// Enroll in course
export function enrollCourse(userId: string, courseId: string): void {
  const data = getProgressData();
  if (!data.courses[courseId]) {
    data.courses[courseId] = { enrolled: true, progress: 0 };
  }
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
}

// Get course progress
export function getCourseProgress(
  userId: string,
  courseId: string,
  totalLessons: number
): number {
  const data = getProgressData();
  const courseProgress = data.courses[courseId];

  if (!courseProgress?.enrolled) return 0;

  const completedLessons = data.lessons.filter(
    (p) => p.userId === userId && p.completed
  ).length;

  return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
}

// Get user stats
export function getUserStats(userId: string, courses: Course[], lessons: Lesson[]) {
  const data = getProgressData();

  // Count enrolled courses
  const enrolledCount = Object.values(data.courses).filter(
    (c) => c.enrolled
  ).length;

  // Count completed lessons
  const completedCount = data.lessons.filter(
    (l) => l.userId === userId && l.completed
  ).length;

  // Count certificates (courses with 100% progress)
  const certificates = Object.entries(data.courses)
    .filter(([courseId, c]) => {
      if (!c.enrolled) return false;
      const course = courses.find((co) => co.id === courseId);
      if (!course) return false;
      const courseLessons = lessons.filter((l) => l.courseId === courseId);
      return getCourseProgress(userId, courseId, courseLessons.length) === 100;
    })
    .length;

  // Calculate overall progress
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return {
    enrolledCourses: enrolledCount,
    completedLessons: completedCount,
    certificates,
    overallProgress: Math.round(overallProgress),
    streak: 0, // TODO: Implement streak calculation
  };
}

// Mark lesson as completed
export function completeLessonQuiz(
  userId: string,
  lessonId: string,
  score: number
): void {
  saveLessonProgress(userId, lessonId, true, score);
}

// Get lessons for a course with completion status
export function getCourseLessonsWithProgress(
  userId: string,
  courseId: string,
  lessons: Lesson[]
): Array<Lesson & { completed: boolean; score: number }> {
  const data = getProgressData();
  const courseLessons = lessons.filter((l) => l.courseId === courseId);

  return courseLessons.map((lesson) => {
    const progress = data.lessons.find(
      (p) => p.lessonId === lesson.id && p.userId === userId
    );
    return {
      ...lesson,
      completed: progress?.completed || false,
      score: progress?.score || 0,
    };
  });
}

// Clear all progress (for development/testing)
export function clearProgressData(): void {
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

// Export all progress data
export function exportProgressData(): string {
  const data = getProgressData();
  return JSON.stringify(data, null, 2);
}

// Import progress data
export function importProgressData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as ProgressData;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
