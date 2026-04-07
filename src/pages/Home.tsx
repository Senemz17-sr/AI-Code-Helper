import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Bug, Zap, BookOpen, Award, Users } from "lucide-react";
import { COURSES } from "@/data/courses";

const features = [
  {
    icon: Code2,
    title: "Explain Code",
    desc: "Get clear, simple explanations of any code snippet in seconds.",
  },
  {
    icon: Bug,
    title: "Fix Errors",
    desc: "Paste your buggy code and get instant fixes with explanations.",
  },
  {
    icon: Zap,
    title: "Optimize Code",
    desc: "Make your code faster, cleaner, and more efficient.",
  },
];

const courseFeatures = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    desc: "Follow guided courses from beginner to advanced levels",
  },
  {
    icon: Award,
    title: "Progress Tracking",
    desc: "Track your progress and earn achievements as you learn",
  },
  {
    icon: Users,
    title: "AI-Powered Learning",
    desc: "Get instant help from AI while solving problems",
  },
];

export default function Home() {
  const activeCourses = COURSES.filter(c => c.enabled).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-hero min-h-[calc(100vh-4rem)]">
        <div className="container flex flex-col items-center px-4 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Coding Platform
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Learn Code with AI
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Master Programming
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Structured courses + AI assistance = Faster learning. Get help instantly while coding.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105 active:scale-100"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Try Code Helper
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-3"
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:gradient-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Learning Courses Section */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Structured Learning Paths
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">Master Programming Languages</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose from {activeCourses} comprehensive courses with AI assistance
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-12">
            {COURSES.filter(c => c.enabled).map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/course/${course.id}`}>
                  <div className={`rounded-lg bg-gradient-to-br ${course.color} p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 h-full cursor-pointer`}>
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="text-sm font-semibold opacity-80 uppercase">
                          {course.level}
                        </div>
                        <h3 className="mt-2 font-bold">{course.title}</h3>
                      </div>
                      <div className="text-xs opacity-80 mt-4">
                        {course.chapters} chapters • {course.duration}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Why Learn with Us?</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {courseFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-border bg-card p-8 shadow-card"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`border-t border-border bg-gradient-to-r from-primary/10 to-primary/5 py-20`}>
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold md:text-4xl">Ready to Start Learning?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of students learning programming with AI assistance
            </p>
            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-4 font-heading text-base font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105"
            >
              Explore Courses Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
