/**
 * Course Logic Index
 * Exports all access control and business logic functions
 */

export {
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
} from "./accessControl";
