// Course and Learning Platform Types

export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "c" | "cpp";
export type QuestionType = "mcq" | "coding";
export type Tier = "free" | "premium" | "advanced";
export type UserRole = "free" | "premium";
export type UserTier = "student" | "instructor" | "admin";

export interface Course {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: Level;
  chapters: number;
  duration: string;
  icon?: string;
  color?: string;
  enabled: boolean;
  tier: Tier;
  price?: number;
  originalPrice?: number;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  enrolledCount?: number;
  isPremiumPreview?: boolean; // Show first lesson free for paid
}

export interface Lesson {
  id: string;
  courseId: string;
  chapter: number;
  title: string;
  description: string;
  content: string;
  explanation: string;
  codeExamples: CodeExample[];
  practiceProblems: PracticeProblem[];
  difficulty: Level;
  video?: string;
  isPremium?: boolean;
  order?: number;
}

export interface CodeExample {
  title: string;
  code: string;
  language: Language;
  explanation?: string;
  output?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  template: string;
  solution: string;
  difficulty: Level;
  language: Language;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  quizPassed: boolean;
  score: number;
  completedAt?: string;
}

export interface UserEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  isPaid: boolean;
  accessExpires?: string;
}

export interface UserBookmark {
  userId: string;
  lessonId: string;
  bookmarkedAt: string;
}

export interface UserCertificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  issuedDate: string;
  certificateUrl?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  enrolledCourses: string[]; // course IDs
  totalProgress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  lessonContext?: string;
  timestamp: string;
}

// ============= USER & ENROLLMENT TYPES =============

export interface CourseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole; // "free" | "premium"
  tier: UserTier; // "student" | "instructor" | "admin"
  enrolledCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  completedCourses: string[]; // Course IDs
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
  attempts?: number;
}

export interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  progress: number; // 0-100
  lastAccessedAt?: string;
  isCompleted: boolean;
  completedAt?: string;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface EnhancedCourse extends Course {
  lessons: EnhancedLesson[];
}

export interface EnhancedLesson extends Lesson {
  isLocked: boolean;
  resources?: Resource[];
  duration?: number; // in minutes
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "link" | "file" | "video";
  icon?: string;
}
