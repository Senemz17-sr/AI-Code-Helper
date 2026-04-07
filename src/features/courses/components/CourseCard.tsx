/**
 * Course Card Component
 * Displays a course with status badges and enrollment info
 */

import React from "react";
import { Lock, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Course, CourseUser } from "@/types/course";
import { canAccessCourse, getCourseProgress } from "../logic/accessControl";

interface CourseCardProps {
  course: Course;
  user?: CourseUser;
  progress?: number;
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  onClick?: (courseId: string) => void;
}

export function CourseCard({
  course,
  user,
  progress = 0,
  onEnroll,
  onContinue,
  onClick,
}: CourseCardProps) {
  const isEnrolled = user?.enrolledCourses.includes(course.id);
  const canAccess = user ? canAccessCourse(user, course) : false;
  const isLocked = !canAccess && course.tier === "premium" && user?.role !== "premium";

  const handleClick = () => {
    if (onClick) onClick(course.id);
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) onEnroll(course.id);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContinue) onContinue(course.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900
        ${isLocked ? "opacity-75" : ""}
      `}
    >
      {/* Header with gradient */}
      <div className={`h-24 bg-gradient-to-r ${course.color || "from-blue-400 to-blue-600"}`}>
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and badges */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-2">
            {course.title}
          </h3>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
          {course.tier === "premium" && (
            <Badge variant="default" className="text-xs bg-amber-500">
              Premium
            </Badge>
          )}
          {course.tier === "free" && (
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course info */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledCount || 0}</span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{course.rating}</span>
            </div>
          )}
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          {isEnrolled && progress < 100 && (
            <Button
              onClick={handleContinue}
              variant="default"
              size="sm"
              className="w-full"
            >
              Continue Learning
            </Button>
          )}
          {isEnrolled && progress === 100 && (
            <Button
              onClick={handleClick}
              variant="outline"
              size="sm"
              className="w-full"
              disabled
            >
              ✓ Completed
            </Button>
          )}
          {!isEnrolled && !isLocked && (
            <Button
              onClick={handleEnroll}
              variant="default"
              size="sm"
              className="w-full"
            >
              Enroll Now
            </Button>
          )}
          {isLocked && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled
            >
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
