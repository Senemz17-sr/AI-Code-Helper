/**
 * Lesson List Component
 * Displays lessons with lock status and progress indicators
 */

import React from "react";
import { ChevronRight, Lock, CheckCircle2, Circle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EnhancedLesson, CourseUser, Course } from "@/types/course";
import {
  canAccessLesson,
  shouldLockLesson,
  getLockReason,
} from "../logic/accessControl";

interface LessonListProps {
  lessons: EnhancedLesson[];
  user: CourseUser;
  course?: Course;
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  onUpgradeClick?: () => void;
}

export function LessonList({
  lessons,
  user,
  course,
  currentLessonId,
  onSelectLesson,
  onUpgradeClick,
}: LessonListProps) {
  const sortedLessons = [...lessons].sort((a, b) => (a.chapter || 0) - (b.chapter || 0));

  return (
    <div className="space-y-2">
      {sortedLessons.map((lesson) => {
        const isLocked = shouldLockLesson(lesson, user, lessons, course);
        const isCompleted = user.completedLessons.includes(lesson.id);
        const isCurrent = lesson.id === currentLessonId;
        const lockReason = getLockReason(lesson, user, lessons, course);
        const isPremium = lesson.isPremium;

        return (
          <div
            key={lesson.id}
            className={`relative group transition-all duration-200 ${
              isCurrent ? "bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
          >
            <button
              onClick={() => !isLocked && onSelectLesson?.(lesson.id)}
              disabled={isLocked}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200
                ${
                  isCurrent
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }
                ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                ${!isLocked && !isCurrent ? "hover:bg-slate-50 dark:hover:bg-slate-800" : ""}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 pt-0.5">
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {!isCompleted && !isLocked && (
                    <Circle className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  )}
                  {isLocked && <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium line-clamp-1 ${
                      isCurrent ? "text-blue-700 dark:text-blue-300" : ""
                    }`}>
                      {lesson.title}
                    </h4>
                    {isPremium && (
                      <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    Chapter {lesson.chapter || 1} • {lesson.difficulty}
                    {lesson.duration && ` • ${lesson.duration}m`}
                  </p>
                </div>

                {/* Chevron */}
                {!isLocked && (
                  <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors ${
                    isCurrent ? "text-blue-500" : ""
                  }`} />
                )}
              </div>
            </button>

            {/* Lock reason tooltip */}
            {isLocked && lockReason && (
              <div className="mt-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                  {lockReason}
                </p>
                {isPremium && user.role !== "premium" && onUpgradeClick && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgradeClick();
                    }}
                    variant="link"
                    size="sm"
                    className="text-xs p-0 h-auto mt-1"
                  >
                    Upgrade to Premium →
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LessonList;
