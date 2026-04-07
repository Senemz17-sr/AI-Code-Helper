import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { COURSES } from "@/data/courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import GuestBanner from "@/components/GuestBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { Language, Level } from "@/types/course";

const LANGUAGE_OPTIONS: { value: Language | "all"; label: string }[] = [
  { value: "all", label: "All Languages" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
];

const LEVEL_OPTIONS: { value: Level | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CoursesPageV2() {
  const { isAuthenticated, user } = useAuth();
  const { canAccessPremium, isEnrolledInCourse } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter courses
  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "all" || course.language === selectedLanguage;

    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;

    return matchesSearch && matchesLanguage && matchesLevel;
  });

  const groupedCourses = {
    free: filteredCourses.filter((c) => c.tier === "free"),
    premium: filteredCourses.filter((c) => c.tier === "premium" || c.tier === "advanced"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {!isAuthenticated && <GuestBanner />}

      <div className="container px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Learn to Code
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Master programming with our comprehensive courses
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border/50"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters && <X className="h-4 w-4" />}
              </Button>

              {/* Active Filter Badges */}
              {selectedLanguage !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLanguage("all")}
                  className="gap-1 text-xs"
                >
                  {LANGUAGE_OPTIONS.find((l) => l.value === selectedLanguage)?.label}
                  <X className="h-3 w-3" />
                </Button>
              )}
              {selectedLevel !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLevel("all")}
                  className="gap-1 text-xs"
                >
                  {LEVEL_OPTIONS.find((l) => l.value === selectedLevel)?.label}
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-card"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Language</label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(v) => setSelectedLanguage(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Level</label>
                  <Select
                    value={selectedLevel}
                    onValueChange={(v) => setSelectedLevel(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-muted-foreground"
        >
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Free Courses Section */}
        {groupedCourses.free.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h2 className="text-xl font-semibold text-foreground">Free Courses</h2>
              <span className="text-sm text-muted-foreground">
                ({groupedCourses.free.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedCourses.free.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    isEnrolled={isEnrolledInCourse(course.id)}
                    canAccess={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Courses Section */}
        {groupedCourses.premium.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-amber-500" />
              <h2 className="text-xl font-semibold text-foreground">Premium Courses</h2>
              <span className="text-sm text-muted-foreground">
                ({groupedCourses.premium.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedCourses.premium.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    isEnrolled={isEnrolledInCourse(course.id)}
                    canAccess={canAccessPremium}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-lg text-muted-foreground">
              No courses found. Try adjusting your filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
