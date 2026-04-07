import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Lock } from "lucide-react";
import { getLessonsByCourse, getCourseById } from "@/data/courses";
import type { Lesson, Course } from "@/types/course";

interface CourseSidebarProps {
  lesson: Lesson;
  course: Course;
  currentLessonId: string;
}

export default function CourseSidebar({
  lesson,
  course,
  currentLessonId,
}: CourseSidebarProps) {
  const lessons = getLessonsByCourse(course.id);
  const currentIdx = lessons.findIndex((l) => l.id === currentLessonId);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto rounded-lg border border-border bg-card p-4"
    >
      {/* Course Header */}
      <div className="mb-6 pb-4 border-b border-border">
        <Link to={`/course/${course.id}`} className="group">
          <div className="flex items-center gap-2 text-sm font-semibold transition-colors group-hover:text-primary">
            <BookOpen className="h-4 w-4" />
            {course.title}
            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
        <div className="mt-2 text-xs text-muted-foreground">
          {currentIdx + 1} of {lessons.length} lessons
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-1">
        {lessons.map((l, idx) => (
          <Link key={l.id} to={`/lesson/${l.id}`}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group rounded-lg px-3 py-2 text-sm transition-all ${
                currentLessonId === l.id
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentLessonId === l.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="truncate flex-1">{l.title}</span>
                {currentLessonId === l.id && (
                  <ChevronRight className="h-4 w-4 opacity-100" />
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Helpful tip */}
      <div className="mt-6 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> Use the AI assistant panel for instant help with code
        and concepts!
      </div>
    </motion.aside>
  );
}
