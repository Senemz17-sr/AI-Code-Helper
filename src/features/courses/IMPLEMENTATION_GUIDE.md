# Course System Implementation Guide

A step-by-step guide to implementing the course system in your learning platform.

## Quick Start (5 minutes)

### 1. Import Components

```typescript
import {
  CourseCard,
  LessonList,
  LessonViewer,
  ProgressBar,
  UpgradeBanner,
} from "@/features/courses/components";

import {
  useUserProgress,
  useCourseFilter,
  useCourseStats,
} from "@/features/courses/hooks";

import {
  canAccessCourse,
  canAccessLesson,
  getCourseProgress,
  getNextLesson,
} from "@/features/courses/logic";

import {
  ALL_COURSES,
  ALL_LESSONS,
  FREE_USER,
  PREMIUM_USER,
  getLessonsForCourse,
} from "@/features/courses/seedData";
```

### 2. Simple Dashboard

```typescript
function CoursesPage() {
  const { user, enrollCourse } = useUserProgress();

  return (
    <div className="grid grid-cols-3 gap-6">
      {ALL_COURSES.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          user={user}
          onEnroll={enrollCourse}
        />
      ))}
    </div>
  );
}
```

### 3. Lesson Page

```typescript
function LessonPage({ courseId, lessonId }) {
  const { user, completeLesson } = useUserProgress();
  const course = ALL_COURSES.find((c) => c.id === courseId);
  const lessons = getLessonsForCourse(courseId);
  const lesson = lessons.find((l) => l.id === lessonId);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <LessonList
          lessons={lessons}
          user={user}
          course={course}
          currentLessonId={lessonId}
          onSelectLesson={(id) => navigate(`/lesson/${id}`)}
        />
      </div>

      <div className="col-span-9">
        <LessonViewer
          lesson={lesson}
          user={user}
          onComplete={completeLesson}
        />
      </div>
    </div>
  );
}
```

## Complete Implementation Examples

### Example 1: Courses Dashboard with Filtering

```typescript
import React, { useState } from "react";
import {
  CourseCard,
  useCourseFilter,
  ALL_COURSES,
  useUserProgress,
} from "@/features/courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CourseDiscoveryPage() {
  const { user, enrollCourse } = useUserProgress();
  const {
    filteredCourses,
    level,
    setLevel,
    premiumOnly,
    setPremiumOnly,
    searchTerm,
    setSearchTerm,
    clearFilters,
  } = useCourseFilter(ALL_COURSES);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Discover Courses</h1>
        <p className="text-slate-600 mt-2">
          Learn new skills with our comprehensive courses
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg space-y-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Level Filter */}
        <div>
          <label className="text-sm font-medium">Level</label>
          <div className="flex gap-2 mt-2">
            {["all", "beginner", "intermediate", "advanced"].map((lv) => (
              <Button
                key={lv}
                variant={level === lv ? "default" : "outline"}
                onClick={() => setLevel(lv)}
                className="capitalize"
              >
                {lv}
              </Button>
            ))}
          </div>
        </div>

        {/* Premium Filter */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="premium"
            checked={premiumOnly}
            onChange={(e) => setPremiumOnly(e.target.checked)}
          />
          <label htmlFor="premium" className="text-sm">
            Premium Courses Only
          </label>
        </div>

        {/* Clear Filters */}
        {(searchTerm || level !== "all" || premiumOnly) && (
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            user={user}
            onEnroll={enrollCourse}
            onClick={(id) => navigate(`/course/${id}`)}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No courses match your filters</p>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Full Lesson Learning Experience

```typescript
import React, { useState, useEffect } from "react";
import {
  LessonViewer,
  LessonList,
  ProgressBar,
  UpgradeBanner,
  useUserProgress,
  canAccessLesson,
  getNextLesson,
  getLockReason,
} from "@/features/courses";
import { ALL_LESSONS, getCourseById } from "@/features/courses/seedData";
import { useParams, useNavigate } from "react-router-dom";

export function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const {
    user,
    completeLesson,
    upgradeToPremium,
    enrollCourse,
  } = useUserProgress();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const course = getCourseById(courseId);
  const lessons = ALL_LESSONS.filter((l) => l.courseId === courseId);
  const currentLesson = lessons.find((l) => l.id === lessonId);
  const isCompleted = user.completedLessons.includes(lessonId);

  if (!course || !currentLesson) {
    return <div>Course or Lesson not found</div>;
  }

  // Check access
  const canAccess = canAccessLesson(user, currentLesson, lessons, course);
  if (!canAccess) {
    const reason = getLockReason(user, currentLesson, lessons, course);
    return (
      <UpgradeBanner
        title="This content is locked"
        description={reason}
        onUpgrade={() => setShowUpgradeModal(true)}
      />
    );
  }

  // Navigate to previous/next lesson
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleComplete = (lessonId: string) => {
    completeLesson(lessonId);
    // Optionally move to next lesson
    if (nextLesson) {
      setTimeout(() => {
        navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (previousLesson) {
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  return (
    <div className="h-screen grid grid-cols-12 gap-6 p-6">
      {/* Sidebar - Lesson List */}
      <div className="col-span-3 overflow-y-auto">
        <div className="sticky top-0 bg-white pb-4">
          <h2 className="font-bold text-lg mb-4">{course.title}</h2>
          <ProgressBar
            progress={getCourseProgress(courseId, user, lessons)}
            size="sm"
          />
        </div>
        <LessonList
          lessons={lessons}
          user={user}
          course={course}
          currentLessonId={lessonId}
          onSelectLesson={(id) =>
            navigate(`/course/${courseId}/lesson/${id}`)
          }
          onUpgradeClick={() => setShowUpgradeModal(true)}
        />
      </div>

      {/* Main Content - Lesson Viewer */}
      <div className="col-span-9">
        <LessonViewer
          lesson={currentLesson}
          user={user}
          isCompleted={isCompleted}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          showNavigationButtons={true}
        />
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            upgradeToPremium();
            setShowUpgradeModal(false);
          }}
        />
      )}
    </div>
  );
}

function UpgradeModal({ onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md">
        <UpgradeBanner
          title="Upgrade to Premium"
          onUpgrade={onUpgrade}
          onDismiss={onClose}
        />
      </div>
    </div>
  );
}
```

### Example 3: Dashboard with User Stats

```typescript
import React from "react";
import {
  CourseCard,
  ProgressBar,
  useCourseStats,
  useUserProgress,
} from "@/features/courses";
import { ALL_COURSES, ALL_LESSONS } from "@/features/courses/seedData";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  const { user, upgradeToPremium } = useUserProgress();
  const stats = useCourseStats(user, ALL_LESSONS.length, ALL_COURSES.length);

  // User's enrolled courses
  const enrolledCourses = ALL_COURSES.filter((c) =>
    user.enrolledCourses.includes(c.id)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>
        <div className="flex gap-4 mt-4">
          <Card className="p-4 flex-1">
            <div className="text-3xl font-bold">{stats.coursesCompleted}</div>
            <div className="text-sm text-slate-600">Courses Completed</div>
          </Card>
          <Card className="p-4 flex-1">
            <div className="text-3xl font-bold">{stats.lessonsCompleted}</div>
            <div className="text-sm text-slate-600">Lessons Completed</div>
          </Card>
          <Card className="p-4 flex-1">
            <div className="text-3xl font-bold">
              {Math.round(stats.completionRate)}%
            </div>
            <div className="text-sm text-slate-600">Overall Progress</div>
          </Card>
        </div>
      </div>

      {/* Premium Status */}
      {!stats.isPremium && (
        <UpgradeBanner
          title="Go Premium"
          description="Unlock advanced courses and exclusive features"
          onUpgrade={upgradeToPremium}
          variant="compact"
        />
      )}

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              progress={getCourseProgress(course.id, user, ALL_LESSONS)}
              onClick={(id) => navigate(`/course/${id}`)}
            />
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-2 gap-4">
            {enrolledCourses.map((course) => {
              const nextLesson = getNextLesson(
                course.id,
                user,
                ALL_LESSONS.filter((l) => l.courseId === course.id)
              );
              if (!nextLesson) return null;

              return (
                <Card
                  key={course.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    navigate(`/course/${course.id}/lesson/${nextLesson.id}`)
                  }
                >
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Next: {nextLesson.title}
                  </p>
                  <ProgressBar
                    progress={getCourseProgress(course.id, user, ALL_LESSONS)}
                    size="sm"
                    showLabel={false}
                  />
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Explore More Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          {ALL_COURSES.filter(
            (c) => !user.enrolledCourses.includes(c.id)
          ).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              onEnroll={(id) => navigate(`/course/${id}`)}
              onClick={(id) => navigate(`/course/${id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Integration Points

### With React Router

```typescript
// routes.tsx
import { DashboardPage, CourseDiscoveryPage, LessonPage } from "@/pages";

export const routes = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/courses",
    element: <CourseDiscoveryPage />,
  },
  {
    path: "/course/:courseId/lesson/:lessonId",
    element: <LessonPage />,
  },
];
```

### With Supabase

```typescript
// Sync local state with database
const { user } = useUserProgress();

useEffect(() => {
  if (!user.id) return;

  // Save to Supabase
  supabase
    .from("user_progress")
    .upsert({
      user_id: user.id,
      enrolled_courses: user.enrolledCourses,
      completed_lessons: user.completedLessons,
      updated_at: new Date(),
    });
}, [user]);
```

### With Stripe

```typescript
// Upgrade with payment
const handleUpgradeClick = async () => {
  // Create checkout session
  const { sessionId } = await stripey.post("/create-checkout-session");

  // Redirect to Stripe
  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (!error) {
    // On success webhook, upgrade user
    upgradeToPremium();
  }
};
```

## Testing

```typescript
import { render, screen } from "@testing-library/react";
import { CourseCard } from "@/features/courses";
import { FREE_USER, BEGINNER_COURSE } from "@/features/courses/seedData";

describe("CourseCard", () => {
  it("displays course title", () => {
    render(<CourseCard course={BEGINNER_COURSE} user={FREE_USER} />);
    expect(screen.getByText("JavaScript Basics")).toBeInTheDocument();
  });

  it("shows enroll button for free user", () => {
    render(
      <CourseCard course={BEGINNER_COURSE} user={FREE_USER} onEnroll={() => {}} />
    );
    expect(screen.getByText("Enroll Now")).toBeInTheDocument();
  });
});
```

---

**Next Steps**: See README.md for detailed API documentation
