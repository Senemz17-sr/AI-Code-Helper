import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, Target, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { COURSES } from "@/data/courses";
import { getEnrollments } from "@/lib/storage";

export default function DashboardV2() {
  const { user, isAuthenticated } = useAuth();
  const { canAccessPremium } = useSubscription();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Please log in to access your dashboard</p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const enrollments = getEnrollments(user.id);
  const enrolledCourses = enrollments.map((e) =>
    COURSES.find((c) => c.id === e.courseId)
  ).filter(Boolean);

  const stats = [
    {
      icon: BookOpen,
      label: "Courses Enrolled",
      value: enrolledCourses.length,
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Total Hours",
      value: enrolledCourses.length * 12,
      color: "text-purple-500",
    },
    {
      icon: Target,
      label: "Completed",
      value: Math.min(enrolledCourses.length * 2, 5),
      color: "text-green-500",
    },
    {
      icon: Zap,
      label: "Streak",
      value: "3 days",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container px-4 py-8 sm:py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey by picking up where you left off
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Your Courses
              </h2>

              <div className="space-y-4">
                {enrolledCourses.map((course, idx) => (
                  <motion.div
                    key={course?.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <Link to={`/course/${course?.id}`}>
                      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {course?.title}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {course?.description}
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                Progress
                              </span>
                              <span className="text-xs font-semibold text-foreground">
                                25%
                              </span>
                            </div>
                            <Progress value={25} className="h-2" />
                          </div>

                          {/* Course Info */}
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>🎓 {course?.level}</span>
                            <span>📚 {course?.chapters} chapters</span>
                            <span>⏱️ {course?.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 space-y-6"
          >
            <div className="space-y-2">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">No courses enrolled yet</p>
              <p className="text-sm text-muted-foreground">
                Start learning by browsing our course catalog
              </p>
            </div>

            <Link to="/courses">
              <Button className="gap-2">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Premium Banner */}
        {!canAccessPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-900 dark:from-amber-950 dark:to-orange-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Unlock Premium Content
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get access to advanced courses and exclusive features
                    </p>
                  </div>
                  <Button className="gap-2 flex-shrink-0">
                    💎 Upgrade Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
