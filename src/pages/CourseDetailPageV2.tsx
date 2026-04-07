import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Lock, PlayCircle, CheckCircle, Star } from "lucide-react";
import { getCourseById, getLessonsByCourse } from "@/data/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import GuestBanner from "@/components/GuestBanner";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useState } from "react";
import { getEnrollments, addEnrollment } from "@/lib/storage";
import { getLessonProgress } from "@/lib/storage";

export default function CourseDetailPageV2() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : undefined;
  const lessons = courseId ? getLessonsByCourse(courseId) : [];
  const { isAuthenticated, user } = useAuth();
  const { canAccessPremium, isEnrolledInCourse, enrollCourse } = useSubscription();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrolled, setEnrolled] = useState(
    user ? isEnrolledInCourse(courseId || "") : false
  );

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const isPremium = course.tier === "premium" || course.tier === "advanced";
  const canAccess = enrolled || !isPremium || canAccessPremium;

  const handleEnrollFree = () => {
    if (!user) return;
    enrollCourse(course.id, false);
    addEnrollment({
      userId: user.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString(),
      isPaid: false,
    });
    setEnrolled(true);
  };

  const handlePurchaseClick = () => {
    if (!user) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setEnrolled(true);
  };

  // Calculate progress
  const completedLessons = lessons.filter((lesson) =>
    user ? getLessonProgress(user.id, lesson.id) : false
  ).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {!isAuthenticated && <GuestBanner />}

      <div className="container px-4 py-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
            ← Back to Courses
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Course Header */}
            <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="pt-8">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{course.level}</Badge>
                        {isPremium && (
                          <Badge className="bg-amber-500 text-white">💎 Premium</Badge>
                        )}
                      </div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {course.title}
                      </h1>
                    </div>
                    {course.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-lg text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                    <span>📚 {course.chapters} chapters</span>
                    <span>⏱️ {course.duration}</span>
                    {course.enrolledCount && (
                      <span>👥 {course.enrolledCount.toLocaleString()} students</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress (if enrolled) */}
            {canAccess && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        {completedLessons} of {lessons.length} lessons completed
                      </span>
                      <span className="font-semibold text-foreground">
                        {progressPercentage}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Overview */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Master the fundamentals of the language",
                    "Build real-world projects",
                    "Understand best practices and patterns",
                    "Write clean, efficient code",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Enrollment Card */}
            <Card className="border-border/50 sticky top-20">
              <CardContent className="pt-6 space-y-4">
                {!canAccess ? (
                  <>
                    <div className="space-y-2">
                      {course.originalPrice && (
                        <div className="text-sm">
                          <span className="text-muted-foreground line-through">
                            ${course.originalPrice}
                          </span>
                        </div>
                      )}
                      <div className="text-3xl font-bold text-foreground">
                        ${course.price || 29.99}
                      </div>
                    </div>
                    <Button
                      onClick={handlePurchaseClick}
                      className="w-full h-10"
                    >
                      Enroll Now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Access all lessons and resources
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-green-600 dark:text-green-400 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      You're enrolled
                    </div>
                    <Link to={`/lesson/${lessons[0]?.id}`} className="w-full">
                      <Button className="w-full h-10">
                        Start Learning
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Lessons List */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  Lessons ({lessons.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons.map((lesson, idx) => {
                    const isCompleted = user ? getLessonProgress(user.id, lesson.id) : false;
                    const isLocked = !canAccess && idx > 0;

                    return (
                      <Link
                        key={lesson.id}
                        to={canAccess || idx === 0 ? `/lesson/${lesson.id}` : "#"}
                        onClick={(e) => {
                          if (!canAccess && idx > 0) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <div
                          className={`p-3 rounded-lg border border-border transition-all ${
                            isLocked
                              ? "bg-muted/30 opacity-60 cursor-not-allowed"
                              : "hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : isLocked ? (
                              <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground line-clamp-1">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Chapter {lesson.chapter}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {course.price && (
        <PaymentModal
          isOpen={showPaymentModal}
          course={course}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          userId={user?.id}
        />
      )}
    </div>
  );
}
