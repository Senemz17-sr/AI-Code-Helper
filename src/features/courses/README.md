# Course System Documentation

A comprehensive, production-ready course management system built for learning platforms. This system handles course access control, lesson progression, user progress tracking, and premium subscriptions.

## 📁 Folder Structure

```
src/features/courses/
├── components/          # React UI components
│   ├── CourseCard.tsx      # Course display card
│   ├── LessonList.tsx      # Lesson list with lock states
│   ├── LessonViewer.tsx    # Full lesson display
│   ├── ProgressBar.tsx     # Progress indicators
│   ├── UpgradeBanner.tsx   # Premium upgrade prompt
│   ├── CodeBlock.tsx       # Syntax-highlighted code
│   └── index.ts            # Component exports
├── hooks/              # React custom hooks
│   ├── useUserProgress.ts  # User state management
│   └── index.ts            # Hook exports
├── logic/              # Business logic
│   ├── accessControl.ts    # Permission & access checks
│   └── index.ts            # Logic exports
├── seedData.ts         # Example courses & users
└── index.ts            # Main export file
```

## 🎓 Core Concepts

### Course Structure

```typescript
// Courses have levels and tiers
Course {
  id: string
  title: string
  level: "beginner" | "intermediate" | "advanced"
  tier: "free" | "premium" | "advanced"
  lessons: Lesson[]
}
```

### Three-Tier Access System

1. **Beginner (FREE)** - Always accessible
2. **Intermediate (Enrollment Required)** - Free for enrolled users
3. **Advanced (PREMIUM ONLY)** - Premium tier users only

### User Roles

```typescript
CourseUser {
  role: "free" | "premium"      // Subscription status
  tier: "student" | "instructor" | "admin"  // User type
  enrolledCourses: string[]
  completedLessons: string[]
  completedCourses: string[]
}
```

## 🔑 Key Functions

### Access Control Functions

```typescript
// Check if user can access a course
canAccessCourse(user: CourseUser, course: Course): boolean

// Check if user can access a lesson
canAccessLesson(
  user: CourseUser,
  lesson: EnhancedLesson,
  allLessons: EnhancedLesson[],
  course?: Course
): boolean

// Get all accessible lessons
getAccessibleLessons(user, lessons): EnhancedLesson[]

// Get locked lessons
getLockedLessons(user, lessons): EnhancedLesson[]

// Check if course is completed
isCourseCompleted(courseId: string, user: CourseUser): boolean

// Get next lesson to learn
getNextLesson(courseId, user, lessons): EnhancedLesson | null

// Calculate course progress
getCourseProgress(courseId, user, lessons): number // 0-100%

// Get reason why lesson is locked
getLockReason(lesson, user, lessons, course): string | null
```

### User State Management Functions

```typescript
// Upgrade user to premium
upgradeToPremium(user: CourseUser): CourseUser

// Enroll user in course
enrollCourse(user: CourseUser, courseId: string): CourseUser

// Mark lesson as completed
completeLesson(user: CourseUser, lessonId: string): CourseUser

// Mark course as completed
completeCourse(user: CourseUser, courseId: string): CourseUser
```

## 🪝 Hooks

### useUserProgress Hook

Manages user state with localStorage persistence.

```typescript
const {
  user,              // Current user
  isLoading,         // Initial load state
  enrollCourse,      // (courseId: string) => void
  completeLesson,    // (lessonId: string) => void
  completeCourse,    // (courseId: string) => void
  upgradeToPremium,  // () => void
  updateUser,        // (updates: Partial<CourseUser>) => void
  resetUser,         // () => void
} = useUserProgress();
```

### useCourseStats Hook

Computed statistics from user data.

```typescript
const stats = useCourseStats(user, totalLessons, totalCourses);
// Returns:
{
  enrollmentRate: number;
  completionRate: number;
  lessonsCompleted: number;
  lessonsRemaining: number;
  coursesCompleted: number;
  isPremium: boolean;
}
```

### useCourseFilter Hook

Filter and search courses.

```typescript
const {
  filteredCourses,
  level,
  setLevel,
  premiumOnly,
  setPremiumOnly,
  searchTerm,
  setSearchTerm,
  clearFilters,
} = useCourseFilter(courses, initialLevel, initialPremiumOnly);
```

## 🎨 Components

### CourseCard

Displays a course with enrollment info and progress.

```jsx
<CourseCard
  course={course}
  user={user}
  progress={45}
  onEnroll={(courseId) => console.log("Enroll:", courseId)}
  onContinue={(courseId) => console.log("Continue:", courseId)}
  onClick={(courseId) => navigate(`/course/${courseId}`)}
/>
```

**Features:**
- Free/Premium badges
- Enrollment status indicators
- Progress bar with percentage
- "Continue Learning" button
- Lock icons for inaccessible courses

### LessonList

Lists lessons with lock states and completed indicators.

```jsx
<LessonList
  lessons={lessons}
  user={user}
  course={course}
  currentLessonId={currentId}
  onSelectLesson={(lessonId) => navigate(`/lesson/${lessonId}`)}
  onUpgradeClick={() => showUpgradeModal()}
/>
```

**Features:**
- Visual lock indicators
- Completion checkmarks
- Lock reason tooltips
- Navigation states
- Conditional upgrade prompts

### LessonViewer

Full-featured lesson display with content, examples, and resources.

```jsx
<LessonViewer
  lesson={lesson}
  user={user}
  isCompleted={isCompleted}
  onPrevious={() => goToPrevious()}
  onNext={() => goToNext()}
  onComplete={(lessonId) => markComplete(lessonId)}
  showNavigationButtons={true}
/>
```

**Features:**
- Markdown content rendering
- Code examples with syntax highlighting
- Resources/attachments
- Navigation buttons
- Bookmark functionality
- Completion tracking

### ProgressBar

Progress visualization component.

```jsx
// Full version
<ProgressBar
  progress={75}
  size="md"
  showPercentage={true}
  showLabel={true}
  label="Course Progress"
  completed={false}
/>

// Mini version
<MiniProgressBar progress={60} showLabel={true} />
```

### UpgradeBanner

Call-to-action for premium upgrade.

```jsx
<UpgradeBanner
  title="Unlock Premium Features"
  description="Get access to advanced courses..."
  onUpgrade={() => showUpgradeFlow()}
  variant="default" // or "compact" or "inline"
  showDismiss={true}
/>
```

## 📊 Usage Examples

### Complete Lesson Flow

```typescript
import {
  useUserProgress,
  canAccessLesson,
  getNextLesson,
  LessonList,
  LessonViewer,
  ProgressBar,
} from "@/features/courses";
import { ALL_LESSONS, getCourseById } from "@/features/courses/seedData";

function CoursePage({ courseId, lessonId }) {
  const { user, completeLesson, upgradeToPremium } = useUserProgress();
  const course = getCourseById(courseId);
  const lessons = ALL_LESSONS.filter((l) => l.courseId === courseId);
  const lesson = lessons.find((l) => l.id === lessonId);

  if (!lesson) return <div>Lesson not found</div>;

  const canAccess = canAccessLesson(user, lesson, lessons, course);
  if (!canAccess) {
    return (
      <UpgradeBanner
        onUpgrade={() => upgradeToPremium()}
      />
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar with lessons */}
      <div className="col-span-3">
        <LessonList
          lessons={lessons}
          user={user}
          course={course}
          currentLessonId={lessonId}
          onSelectLesson={(id) => navigate(`/course/${courseId}/lesson/${id}`)}
        />
      </div>

      {/* Main content */}
      <div className="col-span-9">
        <LessonViewer
          lesson={lesson}
          user={user}
          onComplete={(id) => completeLesson(id)}
        />

        {/* Progress */}
        <ProgressBar
          progress={getCourseProgress(courseId, user, lessons)}
          label="Course Progress"
        />
      </div>
    </div>
  );
}
```

### Dashboard with Course Cards

```typescript
import { CourseCard } from "@/features/courses/components";
import { canAccessCourse } from "@/features/courses/logic";
import { ALL_COURSES } from "@/features/courses/seedData";

function Dashboard() {
  const { user, enrollCourse } = useUserProgress();

  const enrolledCourses = ALL_COURSES.filter((c) =>
    user.enrolledCourses.includes(c.id)
  );

  const availableCourses = ALL_COURSES.filter((c) =>
    canAccessCourse(user, c)
  );

  return (
    <div>
      <h2>My Courses</h2>
      <div className="grid grid-cols-3 gap-4">
        {enrolledCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            user={user}
            onEnroll={(id) => enrollCourse(id)}
          />
        ))}
      </div>

      <h2>Available to Enroll</h2>
      <div className="grid grid-cols-3 gap-4">
        {availableCourses
          .filter((c) => !user.enrolledCourses.includes(c.id))
          .map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              onEnroll={(id) => enrollCourse(id)}
            />
          ))}
      </div>
    </div>
  );
}
```

### Premium Upgrade Flow

```typescript
function UpgradeFlow() {
  const { user, upgradeToPremium } = useUserProgress();

  if (user.role === "premium") {
    return <div>Already premium!</div>;
  }

  const handleUpgrade = () => {
    // In real app, process payment here
    upgradeToPremium();
    toast.success("Upgraded to premium!");
  };

  return (
    <UpgradeBanner
      title="Upgrade to Premium"
      description="Unlock all advanced courses and features"
      onUpgrade={handleUpgrade}
    />
  );
}
```

## 🔒 Access Control Rules

### Course Access

- **Beginner courses**: Always accessible (no enrollment needed)
- **Intermediate courses**: Accessible after enrollment
- **Advanced courses**: Premium tier only

### Lesson Access

1. User must have access to the course
2. Lessons can be premium (require premium user)
3. Lessons can be sequential (require previous lesson completion)
4. First lesson in course is always accessible (if course is accessible)

### Example Access Scenarios

```typescript
// Scenario 1: FREE user, BEGINNER course
canAccessCourse(freeUser, beginnerCourse); // ✓ true

// Scenario 2: FREE user, INTERMEDIATE course (not enrolled)
canAccessCourse(freeUser, intermediateUnknownCourse); // ✗ false

// Scenario 3: FREE user, INTERMEDIATE course (enrolled)
canAccessCourse(freeUser, intermediateEnrolledCourse); // ✓ true

// Scenario 4: FREE user, ADVANCED/PREMIUM course
canAccessCourse(freeUser, advancedCourse); // ✗ false

// Scenario 5: PREMIUM user, ADVANCED course
canAccessCourse(premiumUser, advancedCourse); // ✓ true

// Scenario 6: User, locked lesson in same course
const canAccess = canAccessLesson(user, lesson, allLessons, course);
// Depends on: lesson.isPremium, user role, previous lesson completion
```

## 💾 Data Persistence

User progress is automatically saved to localStorage using `useUserProgress` hook:

```typescript
// Data is saved to: localStorage.coursetutor_user_state
{
  id: "user_001",
  name: "John",
  role: "free",
  enrolledCourses: ["js-beginner"],
  completedLessons: ["js-beginner-1"],
  completedCourses: [],
  // ... other fields
}
```

To reset:
```typescript
const { resetUser } = useUserProgress();
resetUser(); // Clears localStorage and resets to default state
```

## 🚀 Integration with External Systems

### With Supabase (Database)

```typescript
// Fetch user from database
const { data: user } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();

// Update course progress
await supabase
  .from("user_progress")
  .update({ completed_lessons: [...] })
  .eq("user_id", userId);
```

### With Payment System (Stripe)

```typescript
const handleUpgrade = async () => {
  // Stripe payment
  const { sessionId } = await createCheckoutSession();
  
  // Redirect to Stripe
  const result = await stripe.redirectToCheckout({ sessionId });
  
  // On success, upgrade user
  upgradeToPremium();
};
```

### With Analytics

```typescript
import { analytics } from "@/lib/analytics";

const handleEnroll = (courseId: string) => {
  enrollCourse(courseId);
  analytics.track("course_enrolled", {
    courseId,
    userRole: user.role,
  });
};
```

## 📈 Extending the System

### Add Custom Rules

```typescript
// Create custom permission function
function canAccessCoursing(user, course, additionalContext) {
  // Your custom logic
  const canAccessBase = canAccessCourse(user, course);
  const isInAllowedCountry = additionalContext.userCountry === "US";
  
  return canAccessBase && isInAllowedCountry;
}
```

### Add More Course Types

```typescript
// Extend Course type
interface CustomCourse extends Course {
  prerequisites?: string[]; // Required courses
  industry?: string;
  certifications?: string[];
}

// Add to access control
function canAccessCourse(user, course: CustomCourse) {
  const baseCheck = canAccessCourse(user, course as Course);
  
  // Check prerequisites
  const hasPrerequisites = course.prerequisites?.every(
    (prereqId) => user.completedCourses.includes(prereqId)
  );
  
  return baseCheck && hasPrerequisites !== false;
}
```

### Add Progress Milestones

```typescript
function getProgressMilestones(courseId, user, lessons) {
  const courseLessons = lessons.filter((l) => l.courseId === courseId);
  const completed = user.completedLessons.filter((id) =>
    courseLessons.some((l) => l.id === id)
  ).length;

  return {
    started: completed > 0,
    halfway: completed >= courseLessons.length / 2,
    almost: completed >= courseLessons.length * 0.9,
    completed: completed === courseLessons.length,
  };
}
```

## 🎯 Best Practices

1. **Always check access before rendering** - Use access control functions
2. **Show lock reasons** - Use `getLockReason()` for UX
3. **Persist progress** - Use `useUserProgress` hook
4. **Provide upgrade paths** - Show upgrade banner at locked content
5. **Track analytics** - Log when users complete lessons/courses
6. **Handle edge cases** - Check for null/undefined courses/lessons
7. **Optimize component renders** - Memoize list items with React.memo
8. **Use TypeScript** - Leverage strong typing for fewer bugs

## 📚 Resources

- TypeScript types in `/src/types/course.ts`
- Example data in `/src/features/courses/seedData.ts`
- Full implementation in `/src/features/courses/`

---

**Status**: Production-ready
**Last Updated**: 2024
