# Quick Reference Guide - Course System

Fast lookup for the course system API and components.

## 🚀 Import Everything

```typescript
// All exports
import {
  // Components
  CourseCard,
  LessonList,
  LessonViewer,
  ProgressBar,
  MiniProgressBar,
  UpgradeBanner,
  CodeBlock,
  
  // Hooks
  useUserProgress,
  useCourseStats,
  useCourseFilter,
  
  // Logic
  canAccessCourse,
  canAccessLesson,
  getAccessibleLessons,
  getLockedLessons,
  isCourseCompleted,
  getNextLesson,
  getCourseProgress,
  shouldLockLesson,
  getLockReason,
  upgradeToPremium,
  enrollCourse,
  completeLesson,
  completeCourse,
} from "@/features/courses";

// Example data
import {
  ALL_COURSES,
  ALL_LESSONS,
  BEGINNER_COURSE,
  INTERMEDIATE_COURSE,
  ADVANCED_COURSE,
  FREE_USER,
  PREMIUM_USER,
  GUEST_USER,
  getLessonsForCourse,
  getCourseById,
  getUserCourses,
  getAvailableCourses,
} from "@/features/courses/seedData";
```

## 📦 Component API

### CourseCard
```typescript
interface CourseCardProps {
  course: Course;
  user?: CourseUser;
  progress?: number;  // 0-100
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  onClick?: (courseId: string) => void;
}

<CourseCard
  course={course}
  user={user}
  progress={45}
  onEnroll={enrollCourse}
  onContinue={goToCourse}
  onClick={viewCourse}
/>
```

### LessonList
```typescript
interface LessonListProps {
  lessons: EnhancedLesson[];
  user: CourseUser;
  course?: Course;
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  onUpgradeClick?: () => void;
}

<LessonList
  lessons={lessons}
  user={user}
  course={course}
  currentLessonId={currentId}
  onSelectLesson={selectLesson}
  onUpgradeClick={showUpgrade}
/>
```

### LessonViewer
```typescript
interface LessonViewerProps {
  lesson: EnhancedLesson;
  user: CourseUser;
  isCompleted?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: (lessonId: string) => void;
  showNavigationButtons?: boolean;
}

<LessonViewer
  lesson={lesson}
  user={user}
  isCompleted={completed}
  onPrevious={goToPrevious}
  onNext={goToNext}
  onComplete={markComplete}
  showNavigationButtons
/>
```

### ProgressBar
```typescript
interface ProgressBarProps {
  progress: number;           // 0-100
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  completed?: boolean;
}

<ProgressBar progress={75} size="md" label="Course Progress" />

// Mini version
<MiniProgressBar progress={60} showLabel={true} />
```

### UpgradeBanner
```typescript
interface UpgradeBannerProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  variant?: "default" | "compact" | "inline";
  showDismiss?: boolean;
}

<UpgradeBanner
  title="Premium Unlocked"
  onUpgrade={upgrade}
  variant="default"
  showDismiss
/>
```

### CodeBlock
```typescript
interface CodeBlockProps {
  language?: string;  // javascript, python, etc.
  children?: string;  // code content
  className?: string;
}

<CodeBlock language="javascript">
  {`console.log("Hello World");`}
</CodeBlock>
```

## 🪝 Hook API

### useUserProgress
```typescript
const {
  user: CourseUser,
  isLoading: boolean,
  enrollCourse: (courseId: string) => void,
  completeLesson: (lessonId: string) => void,
  completeCourse: (courseId: string) => void,
  upgradeToPremium: () => void,
  updateUser: (updates: Partial<CourseUser>) => void,
  resetUser: () => void,
} = useUserProgress();
```

### useCourseStats
```typescript
const stats = useCourseStats(user, totalLessons, totalCourses);
// Returns:
{
  enrollmentRate: number;      // 0-100
  completionRate: number;      // 0-100
  lessonsCompleted: number;
  lessonsRemaining: number;
  coursesCompleted: number;
  isPremium: boolean;
}
```

### useCourseFilter
```typescript
const {
  filteredCourses: Course[],
  level: string,
  setLevel: (level: string) => void,
  premiumOnly: boolean,
  setPremiumOnly: (value: boolean) => void,
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  clearFilters: () => void,
} = useCourseFilter(
  courses,
  initialLevel,   // "beginner" | "intermediate" | "advanced" | "all"
  initialPremiumOnly
);
```

## 🔑 Logic Functions

### Access Control

```typescript
// Course access
canAccessCourse(user: CourseUser, course: Course): boolean

// Lesson access
canAccessLesson(
  user: CourseUser,
  lesson: EnhancedLesson,
  allLessons: EnhancedLesson[],
  course?: Course
): boolean

// Get lessons
getAccessibleLessons(user, lessons, course?): EnhancedLesson[]
getLockedLessons(user, lessons, course?): EnhancedLesson[]

// Completion checks
isCourseCompleted(courseId: string, user: CourseUser): boolean

// Get next item
getNextLesson(courseId, user, lessons, course?): EnhancedLesson | null

// Progress calculation
getCourseProgress(courseId, user, lessons): number  // 0-100

// Lock status
shouldLockLesson(lesson, user, allLessons, course?): boolean
getLockReason(lesson, user, allLessons, course?): string | null
```

### State Management

```typescript
upgradeToPremium(user: CourseUser): CourseUser
enrollCourse(user: CourseUser, courseId: string): CourseUser
completeLesson(user: CourseUser, lessonId: string): CourseUser
completeCourse(user: CourseUser, courseId: string): CourseUser
```

## 📊 Type System

### User
```typescript
interface CourseUser {
  id: string;
  name: string;
  email: string;
  role: "free" | "premium";
  tier: "student" | "instructor" | "admin";
  enrolledCourses: string[];      // course IDs
  completedLessons: string[];     // lesson IDs
  completedCourses: string[];     // course IDs
  createdAt: string;              // ISO date
  updatedAt: string;              // ISO date
}
```

### Course
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  language: "javascript" | "python" | "c" | "cpp";
  level: "beginner" | "intermediate" | "advanced";
  chapters: number;
  duration: string;                  // e.g., "3 weeks"
  color?: string;                    // gradient CSS
  enabled: boolean;
  tier: "free" | "premium" | "advanced";
  price?: number;
  originalPrice?: number;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  enrolledCount?: number;
  isPremiumPreview?: boolean;
}
```

### Lesson
```typescript
interface EnhancedLesson extends Lesson {
  id: string;
  courseId: string;
  chapter: number;
  title: string;
  description: string;
  content: string;                // Markdown content
  explanation: string;            // Key takeaway
  codeExamples: CodeExample[];
  practiceProblems: PracticeProblem[];
  difficulty: "beginner" | "intermediate" | "advanced";
  video?: string;
  isPremium?: boolean;
  isLocked: boolean;              // Computed
  resources?: Resource[];
  duration?: number;              // minutes
  order?: number;
}
```

## 💡 Common Patterns

### Get User Courses
```typescript
const userCourses = getAllCourses(user).filter(c => 
  user.enrolledCourses.includes(c.id)
);
```

### Get Accessible Courses
```typescript
const accessibleCourses = ALL_COURSES.filter(c =>
  canAccessCourse(user, c)
);
```

### Calculate Overall Progress
```typescript
const progress = (user.completedLessons.length / ALL_LESSONS.length) * 100;
```

### Check if Course Complete
```typescript
const isComplete = isCourseCompleted(courseId, user);
```

### Get Next Lesson
```typescript
const nextLesson = getNextLesson(courseId, user, lessons, course);
if (!nextLesson) {
  // Course complete!
}
```

### Get Lock Reason
```typescript
const reason = getLockReason(lesson, user, allLessons, course);
if (reason) {
  console.log("Reason lesson is locked:", reason);
}
```

## 🎯 Complete Example (50 lines)

```typescript
import {
  CourseCard,
  LessonList,
  LessonViewer,
  ProgressBar,
  UpgradeBanner,
  useUserProgress,
  canAccessCourse,
  canAccessLesson,
  getCourseProgress,
} from "@/features/courses";
import { ALL_COURSES, ALL_LESSONS } from "@/features/courses/seedData";

function App() {
  const { user, enrollCourse, completeLesson, upgradeToPremium } =
    useUserProgress();
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");

  const course = ALL_COURSES.find((c) => c.id === courseId);
  const lessons = ALL_LESSONS.filter((l) => l.courseId === courseId);
  const lesson = lessons.find((l) => l.id === lessonId);

  if (!course || !lesson) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {ALL_COURSES.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            user={user}
            onEnroll={(id) => {
              enrollCourse(id);
              setCourseId(id);
            }}
          />
        ))}
      </div>
    );
  }

  if (!canAccessLesson(user, lesson, lessons, course)) {
    return (
      <UpgradeBanner
        onUpgrade={upgradeToPremium}
      />
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <LessonList
          lessons={lessons}
          user={user}
          currentLessonId={lessonId}
          onSelectLesson={setLessonId}
        />
      </div>

      <div className="col-span-9">
        <LessonViewer
          lesson={lesson}
          user={user}
          onComplete={completeLesson}
        />
        <ProgressBar
          progress={getCourseProgress(courseId, user, lessons)}
        />
      </div>
    </div>
  );
}
```

## 📚 Documentation

- **README.md** - Complete API docs and best practices
- **IMPLEMENTATION_GUIDE.md** - Real-world examples
- **seedData.ts** - Example courses and users
- **index.ts** - Main exports

## 🎓 Learning Path

1. Start with `seedData.ts` - understand the data
2. Read `README.md` - learn the API
3. Try `IMPLEMENTATION_GUIDE.md` - see examples
4. Explore components/* - see the implementations
5. Use in your app - integrate patterns

---

**Status: Ready to Use** ✅
