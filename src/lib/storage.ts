// Local storage management for enrollments, bookmarks, and purchases

import { UserEnrollment, UserBookmark, UserCertificate } from "@/types/course";

const STORAGE_KEYS = {
  ENROLLMENTS: "codetutor_enrollments",
  BOOKMARKS: "codetutor_bookmarks",
  CERTIFICATES: "codetutor_certificates",
  PROGRESS: "codetutor_progress",
  PURCHASES: "codetutor_purchases",
};

// ============= ENROLLMENTS =============
export const getEnrollments = (userId: string): UserEnrollment[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
  const enrollments = stored ? JSON.parse(stored) : [];
  return enrollments.filter((e: UserEnrollment) => e.userId === userId);
};

export const addEnrollment = (enrollment: UserEnrollment): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
  const enrollments = stored ? JSON.parse(stored) : [];
  
  const exists = enrollments.some(
    (e: UserEnrollment) =>
      e.userId === enrollment.userId && e.courseId === enrollment.courseId
  );
  
  if (!exists) {
    enrollments.push(enrollment);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  }
};

export const isEnrolled = (userId: string, courseId: string): boolean => {
  const enrollments = getEnrollments(userId);
  return enrollments.some((e) => e.courseId === courseId);
};

// ============= BOOKMARKS =============
export const getBookmarks = (userId: string): UserBookmark[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  const bookmarks = stored ? JSON.parse(stored) : [];
  return bookmarks.filter((b: UserBookmark) => b.userId === userId);
};

export const toggleBookmark = (userId: string, lessonId: string): boolean => {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
  const bookmarks = stored ? JSON.parse(stored) : [];
  
  const existingIndex = bookmarks.findIndex(
    (b: UserBookmark) => b.userId === userId && b.lessonId === lessonId
  );

  if (existingIndex > -1) {
    bookmarks.splice(existingIndex, 1);
  } else {
    bookmarks.push({
      userId,
      lessonId,
      bookmarkedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  return existingIndex === -1; // true if added, false if removed
};

export const isBookmarked = (userId: string, lessonId: string): boolean => {
  const bookmarks = getBookmarks(userId);
  return bookmarks.some((b) => b.lessonId === lessonId);
};

// ============= CERTIFICATES =============
export const getCertificates = (userId: string): UserCertificate[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  const certificates = stored ? JSON.parse(stored) : [];
  return certificates.filter((c: UserCertificate) => c.userId === userId);
};

export const addCertificate = (certificate: UserCertificate): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  const certificates = stored ? JSON.parse(stored) : [];
  
  const exists = certificates.some(
    (c: UserCertificate) => c.courseId === certificate.courseId && c.userId === certificate.userId
  );
  
  if (!exists) {
    certificates.push(certificate);
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  }
};

// ============= PROGRESS =============
export const getLessonProgress = (userId: string, lessonId: string): boolean => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const progress = stored ? JSON.parse(stored) : {};
  return progress[`${userId}_${lessonId}`] || false;
};

export const markLessonComplete = (userId: string, lessonId: string): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const progress = stored ? JSON.parse(stored) : {};
  progress[`${userId}_${lessonId}`] = true;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const getCourseProgress = (userId: string, courseId: string, totalLessons: number): number => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const progress = stored ? JSON.parse(stored) : {};
  
  let completed = 0;
  for (let i = 1; i <= totalLessons; i++) {
    if (progress[`${userId}_lesson_${courseId}_${i}`]) {
      completed++;
    }
  }
  
  return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
};

// ============= PURCHASES =============
export const recordPurchase = (userId: string, courseId: string, price: number): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.PURCHASES);
  const purchases = stored ? JSON.parse(stored) : [];
  
  purchases.push({
    id: `purch_${Date.now()}`,
    userId,
    courseId,
    purchasedAt: new Date().toISOString(),
    price,
    paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
  });
  
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
};

export const getPurchaseHistory = (userId: string) => {
  const stored = localStorage.getItem(STORAGE_KEYS.PURCHASES);
  const purchases = stored ? JSON.parse(stored) : [];
  return purchases.filter((p: any) => p.userId === userId);
};
