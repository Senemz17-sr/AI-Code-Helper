// Course and Learning Platform Types

export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "c" | "cpp";
export type QuestionType = "mcq" | "coding";

export interface Course {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: Level;
  chapters: number;
  duration: string; // e.g. "4 weeks"
  icon?: string;
  color?: string;
  enabled: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  chapter: number;
  title: string;
  description: string;
  content: string; // HTML or Markdown
  explanation: string;
  codeExamples: CodeExample[];
  practiceProblems: PracticeProblem[];
  difficulty: Level;
  video?: string;
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
