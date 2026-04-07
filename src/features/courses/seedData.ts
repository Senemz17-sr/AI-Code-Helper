/**
 * Example Course Data
 * Seed data for courses, lessons, code examples, and users
 */

import type {
  Course,
  EnhancedLesson,
  CodeExample,
  PracticeProblem,
  CourseUser,
} from "@/types/course";

// ============= BEGINNER COURSES (FREE) =============

export const BEGINNER_COURSE: Course = {
  id: "js-beginner",
  title: "JavaScript Basics",
  description: "Learn JavaScript fundamentals from scratch. Perfect for complete beginners.",
  language: "javascript",
  level: "beginner",
  chapters: 5,
  duration: "3 weeks",
  color: "from-yellow-400 to-orange-500",
  enabled: true,
  tier: "free",
  rating: 4.8,
  enrolledCount: 2543,
  instructor: "Sarah Chen",
  thumbnail: "/images/js-basics.jpg",
};

export const BEGINNER_LESSONS: EnhancedLesson[] = [
  {
    id: "js-beginner-1",
    courseId: "js-beginner",
    chapter: 1,
    title: "Getting Started with JavaScript",
    description: "Introduction to JavaScript and setting up your environment",
    content: `# Getting Started with JavaScript

JavaScript is a programming language that powers interactive web experiences. It runs in browsers and can also run on servers (Node.js).

## What You'll Learn
- Basic JavaScript syntax
- Variables and data types
- How to run JavaScript code

## Why JavaScript?
- Powers 97% of websites
- Easy to learn for beginners
- Immediate visual feedback in browsers
- In-demand skill in tech industry`,
    explanation:
      "JavaScript is the language of the web. Every interactive element on a website likely uses JavaScript.",
    codeExamples: [
      {
        title: "Hello World",
        code: 'console.log("Hello, World!");',
        language: "javascript",
        explanation:
          "This is the simplest JavaScript program. It prints text to the console.",
      },
    ],
    practiceProblems: [],
    difficulty: "beginner",
    duration: 15,
    isPremium: false,
    isLocked: false,
    order: 1,
  },
  {
    id: "js-beginner-2",
    courseId: "js-beginner",
    chapter: 2,
    title: "Variables and Data Types",
    description: "Learn how to store and manipulate data in JavaScript",
    content: `# Variables and Data Types

Variables are containers for storing data values. JavaScript has several data types.

## Creating Variables
- \`var\` (older, not recommended)
- \`let\` (modern, recommended)
- \`const\` (constant, cannot be changed)

## Data Types
- **String**: Text, e.g., "Hello"
- **Number**: Integers and decimals, e.g., 42, 3.14
- **Boolean**: true or false
- **Undefined**: No value assigned
- **Null**: Intentional no value`,
    explanation:
      "Variables are the building blocks of programming. They let you store and manipulate data.",
    codeExamples: [
      {
        title: "Creating Variables",
        code: `let name = "Alice";
let age = 25;
let isStudent = true;

console.log(name);    // Alice
console.log(age);     // 25
console.log(isStudent); // true`,
        language: "javascript",
      },
    ],
    practiceProblems: [],
    difficulty: "beginner",
    duration: 20,
    isPremium: false,
    isLocked: false,
    order: 2,
  },
  {
    id: "js-beginner-3",
    courseId: "js-beginner",
    chapter: 3,
    title: "Functions",
    description: "Reusable blocks of code that perform specific tasks",
    content: `# Functions

Functions are reusable blocks of code that perform specific tasks.

## Function Syntax
\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}
\`\`\`

## Parameters and Return Values
- **Parameters**: Input values for the function
- **Return**: Output value from the function

## Function Types
- Named functions
- Arrow functions (modern syntax)
- Anonymous functions`,
    explanation:
      "Functions help you write cleaner, reusable code. Don't repeat yourself!",
    codeExamples: [
      {
        title: "Simple Function",
        code: `function add(a, b) {
  return a + b;
}

console.log(add(5, 3)); // 8`,
        language: "javascript",
      },
      {
        title: "Arrow Function",
        code: `const multiply = (a, b) => a * b;

console.log(multiply(4, 5)); // 20`,
        language: "javascript",
      },
    ],
    practiceProblems: [],
    difficulty: "beginner",
    duration: 25,
    isPremium: false,
    isLocked: false,
    order: 3,
  },
];

// ============= INTERMEDIATE COURSES =============

export const INTERMEDIATE_COURSE: Course = {
  id: "js-intermediate",
  title: "JavaScript Advanced",
  description: "Master advanced JavaScript concepts like closures, async/await, and more.",
  language: "javascript",
  level: "intermediate",
  chapters: 8,
  duration: "4 weeks",
  color: "from-orange-400 to-red-500",
  enabled: true,
  tier: "premium",
  rating: 4.9,
  enrolledCount: 1250,
  instructor: "Mike Johnson",
  isPremiumPreview: true,
};

export const INTERMEDIATE_LESSONS: EnhancedLesson[] = [
  {
    id: "js-intermediate-1",
    courseId: "js-intermediate",
    chapter: 1,
    title: "Closures and Scope",
    description: "Understanding lexical scope and closures",
    content: `# Closures and Scope

Closures are functions that have access to variables from another function's scope.

## Lexical Scope
- Inner functions can access outer function variables
- Variables are "closed over"
- Creates private variables

## Practical Uses
- Data privacy
- Function factories
- Event handlers`,
    explanation:
      "Closures are one of the most powerful features in JavaScript. They enable data privacy and encapsulation.",
    codeExamples: [
      {
        title: "Closure Example",
        code: `function counter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2`,
        language: "javascript",
      },
    ],
    practiceProblems: [],
    difficulty: "intermediate",
    duration: 30,
    isPremium: false, // First lesson is free preview
    isLocked: false,
    order: 1,
  },
  {
    id: "js-intermediate-2",
    courseId: "js-intermediate",
    chapter: 2,
    title: "Async/Await and Promises",
    description: "Handle asynchronous operations elegantly",
    content: `# Async/Await and Promises

Async/await makes asynchronous code look and behave more like synchronous code.

## Promises
- Represent eventual completion/failure of async operation
- States: Pending, Fulfilled, Rejected

## Async/Await
- Syntactic sugar for Promises
- Try/catch for error handling
- Cleaner, more readable code`,
    explanation:
      "Async/await revolutionized JavaScript. It makes handling async code much simpler.",
    codeExamples: [
      {
        title: "Async/Await Example",
        code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}`,
        language: "javascript",
      },
    ],
    practiceProblems: [],
    difficulty: "intermediate",
    duration: 35,
    isPremium: true, // Premium content
    isLocked: true,
    order: 2,
  },
];

// ============= ADVANCED COURSES (PREMIUM ONLY) =============

export const ADVANCED_COURSE: Course = {
  id: "js-advanced",
  title: "JavaScript Expert - Design Patterns & Architecture",
  description:
    "Master design patterns, architecture patterns, and advanced JavaScript concepts for scalable applications.",
  language: "javascript",
  level: "advanced",
  chapters: 12,
  duration: "6 weeks",
  color: "from-purple-500 to-pink-600",
  enabled: true,
  tier: "advanced",
  price: 99,
  originalPrice: 149,
  rating: 5.0,
  enrolledCount: 342,
  instructor: "Dr. Alex Rivera",
};

// ============= EXAMPLE USERS =============

export const GUEST_USER: CourseUser = {
  id: "user_guest",
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

export const FREE_USER: CourseUser = {
  id: "user_001",
  name: "John Doe",
  email: "john@example.com",
  role: "free",
  tier: "student",
  enrolledCourses: ["js-beginner"],
  completedLessons: ["js-beginner-1", "js-beginner-2"],
  completedCourses: [],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: new Date().toISOString(),
};

export const PREMIUM_USER: CourseUser = {
  id: "user_002",
  name: "Jane Smith",
  email: "jane@example.com",
  role: "premium",
  tier: "student",
  enrolledCourses: ["js-beginner", "js-intermediate", "js-advanced"],
  completedLessons: [
    "js-beginner-1",
    "js-beginner-2",
    "js-beginner-3",
    "js-intermediate-1",
    "js-intermediate-2",
  ],
  completedCourses: ["js-beginner"],
  createdAt: "2023-11-20T08:30:00Z",
  updatedAt: new Date().toISOString(),
};

// ============= ALL COURSES =============

export const ALL_COURSES: Course[] = [
  BEGINNER_COURSE,
  INTERMEDIATE_COURSE,
  ADVANCED_COURSE,
];

// ============= ALL LESSONS =============

export const ALL_LESSONS: EnhancedLesson[] = [
  ...BEGINNER_LESSONS,
  ...INTERMEDIATE_LESSONS,
];

// ============= HELPER FUNCTION =============

/**
 * Get lessons for a specific course
 */
export function getLessonsForCourse(courseId: string): EnhancedLesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.courseId === courseId);
}

/**
 * Get a course by ID
 */
export function getCourseById(courseId: string): Course | undefined {
  return ALL_COURSES.find((course) => course.id === courseId);
}

/**
 * Get all courses for a user (enrolled)
 */
export function getUserCourses(user: CourseUser): Course[] {
  return ALL_COURSES.filter((course) => user.enrolledCourses.includes(course.id));
}

/**
 * Get available courses for a user (can access)
 */
export function getAvailableCourses(
  user: CourseUser,
  canAccessFn: (user: CourseUser, course: Course) => boolean
): Course[] {
  return ALL_COURSES.filter((course) => canAccessFn(user, course));
}
