import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCourseById, getLessonsByCourse } from "@/data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, BookOpen, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Level } from "@/types/course";

const LEVEL_COLORS: Record<Level, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : undefined;
  const lessons = courseId ? getLessonsByCourse(courseId) : [];

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Calculate progress (placeholder - 0% for all)
  const progressPercentage = 0;
  const completedLessons = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 py-12">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/courses" className="text-sm text-primary hover:underline">
            ← Back to Courses
          </Link>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-10 rounded-2xl bg-gradient-to-br ${
            course.color || "from-blue-500 to-purple-600"
          } p-8 text-white shadow-xl`}
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  {course.level}
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-white/90">{course.description}</p>
            </div>
            <div className="space-y-2">
              <div className="text-right">
                <div className="text-3xl font-bold">{completedLessons}</div>
                <div className="text-sm text-white/80">of {lessons.length} lessons</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 grid gap-4 md:grid-cols-4"
        >
          {[
            { label: "Total Chapters", value: course.chapters },
            { label: "Duration", value: course.duration },
            { label: "Difficulty", value: course.level.charAt(0).toUpperCase() + course.level.slice(1) },
            { label: "AI Assistant", value: "Available" },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="mt-1 text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Progress</h2>
            <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="mt-2 text-sm text-muted-foreground">
            {completedLessons} out of {lessons.length} lessons completed
          </div>
        </motion.div>

        {/* Lessons List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="mb-6 text-2xl font-bold">Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <Link to={`/lesson/${lesson.id}`}>
                  <Card className="transition-all hover:shadow-lg hover:ring-1 hover:ring-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Completion Status */}
                        <div className="mt-4 flex-shrink-0">
                          {false ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>

                        {/* Lesson Content */}
                        <div className="flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                  Chapter {lesson.chapter}: {lesson.title}
                                </h3>
                                <Badge variant="outline">{lesson.difficulty}</Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {lesson.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 whitespace-nowrap"
                            >
                              Start
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
