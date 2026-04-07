import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COURSES } from "@/data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import type { Language, Level } from "@/types/course";

const LANGUAGE_NAMES: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
  c: "C",
  cpp: "C++",
};

const LEVEL_COLORS: Record<Level, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function CoursesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");

  const filteredCourses = COURSES.filter((course) =>
    selectedLanguage === "all" ? true : course.language === selectedLanguage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Learning Courses</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Choose a course and start learning programming today
          </p>
        </motion.div>

        {/* Language Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          <Button
            variant={selectedLanguage === "all" ? "default" : "outline"}
            onClick={() => setSelectedLanguage("all")}
            className="rounded-full"
          >
            All Languages
          </Button>
          {(["javascript", "python", "c", "cpp"] as Language[]).map((lang) => (
            <Button
              key={lang}
              variant={selectedLanguage === lang ? "default" : "outline"}
              onClick={() => setSelectedLanguage(lang)}
              className="rounded-full"
            >
              {LANGUAGE_NAMES[lang]}
            </Button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    course.color || "from-blue-400 to-purple-600"
                  } opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                <CardHeader className="relative">
                  <div className="mb-3 flex items-start justify-between">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <Badge variant="secondary" className={LEVEL_COLORS[course.level]}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{course.description}</CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Course Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chapters:</span>
                      <span className="font-semibold">{course.chapters}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-semibold">{LANGUAGE_NAMES[course.language]}</span>
                    </div>
                  </div>

                  {/* Progress bar placeholder */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">0%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/course/${course.id}`}>
                    <Button className="w-full gap-2 rounded-lg transition-all group-hover:gap-3">
                      <span>
                        {course.enabled ? "Start Learning" : "Coming Soon"}
                      </span>
                      {course.enabled && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </Link>

                  {/* AI Badge */}
                  <div className="flex items-center justify-center gap-1 rounded-lg bg-primary/5 py-2 text-xs font-medium text-primary">
                    <Zap className="h-3 w-3" />
                    AI Assistant Included
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No courses found for the selected language.</p>
          </div>
        )}
      </div>
    </div>
  );
}
