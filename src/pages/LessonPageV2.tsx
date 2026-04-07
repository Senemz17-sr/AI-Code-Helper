import { useState, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Code2,
  CheckCircle2,
  MessageSquare,
  FileText,
} from "lucide-react";
import { getLessonById, getLessonsByCourse, getCourseById } from "@/data/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import CodeEditor from "@/components/CodeEditor";
import ResponsePanel from "@/components/ResponsePanel";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import GuestBanner from "@/components/GuestBanner";
import BookmarkButton from "@/components/BookmarkButton";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { markLessonComplete, getLessonProgress } from "@/lib/storage";

export default function LessonPageV2() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const course = lesson ? getCourseById(lesson.courseId) : undefined;
  const lessons = lesson ? getLessonsByCourse(lesson.courseId) : [];
  const { dark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"lesson" | "practice">("lesson");
  const [code, setCode] = useState<string>(
    lesson?.practiceProblems[0]?.template || ""
  );
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    user && lesson ? getLessonProgress(user.id, lesson.id) : false
  );
  const responseRef = useRef<HTMLDivElement>(null);

  if (!lesson || !course) {
    return <Navigate to="/courses" replace />;
  }

  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < lessons.length - 1
      ? lessons[currentLessonIndex + 1]
      : null;

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-code`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
          }`,
        },
        body: JSON.stringify({
          code,
          language: course.language,
          action: "run",
        }),
      });

      if (!response.ok) throw new Error("Failed to run code");

      // Parse streaming response
      const text = await response.text();
      const lines = text.split('\n');
      let content = '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices?.[0]?.delta?.content) {
              content += data.choices[0].delta.content;
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }

      setOutput(content || "Code analyzed successfully!");
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMarkComplete = () => {
    if (!user) return;
    markLessonComplete(user.id, lesson.id);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setCode(lesson.practiceProblems[0]?.template || "");
    setOutput("");
  };

  // Calculate course progress
  const completedCount = lessons.filter(
    (l) => user && getLessonProgress(user.id, l.id)
  ).length;
  const progressPercentage = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gray-50"}`}>
      {!isAuthenticated && <GuestBanner />}

      {/* Header with Progress */}
      <div
        className={`border-b ${
          dark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
        } sticky top-0 z-40`}
      >
        <div className="container px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <Link
              to={`/course/${course.id}`}
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              ← {course.title}
            </Link>
            <div className="flex items-center gap-3">
              <BookmarkButton lessonId={lesson.id} />
              <Button
                variant={showAI ? "default" : "outline"}
                size="sm"
                onClick={() => (isAuthenticated ? setShowAI(!showAI) : null)}
                disabled={!isAuthenticated}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Ask AI
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Chapter {lesson.chapter}: {lesson.title}
              </span>
              <span className="font-semibold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container grid gap-6 px-4 py-8 lg:grid-cols-4">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full justify-start grid w-full grid-cols-2">
              <TabsTrigger value="lesson" className="gap-2">
                <Book className="h-4 w-4" />
                Lesson
              </TabsTrigger>
              <TabsTrigger value="practice" className="gap-2">
                <Code2 className="h-4 w-4" />
                Practice
              </TabsTrigger>
            </TabsList>

            {/* Lesson Tab */}
            <TabsContent value="lesson" className="space-y-6">
              {/* Content */}
              <Card>
                <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                  <div
                    className="space-y-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: lesson.content
                        .split("\n")
                        .map((line) => {
                          if (line.startsWith("# ")) return `<h2 class="text-2xl font-bold mt-4 mb-2">${line.slice(2)}</h2>`;
                          if (line.startsWith("## "))
                            return `<h3 class="text-xl font-semibold mt-3 mb-2">${line.slice(3)}</h3>`;
                          if (line.startsWith("- "))
                            return `<li class="ml-4">${line.slice(2)}</li>`;
                          if (line.trim() === "") return `<br />`;
                          return `<p>${line}</p>`;
                        })
                        .join("")
                        .replace(/(<li.*?<\/li>)/gs, (match) => `<ul class="list-disc space-y-1">${match}</ul>`),
                    }}
                  />
                </CardContent>
              </Card>

              {/* Code Examples */}
              {lesson.codeExamples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Code Examples</h3>
                  {lesson.codeExamples.map((example, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{example.title}</h4>
                          {example.explanation && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {example.explanation}
                            </p>
                          )}
                        </div>
                        <div
                          className={`rounded-lg border p-4 font-mono text-sm overflow-x-auto ${
                            dark
                              ? "border-slate-700 bg-slate-800"
                              : "border-gray-200 bg-gray-100"
                          }`}
                        >
                          <pre className="text-sm whitespace-pre-wrap break-words">
                            {example.code}
                          </pre>
                        </div>
                        {example.output && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold">Output</div>
                            <div
                              className={`rounded-lg border p-3 font-mono text-sm ${
                                dark
                                  ? "border-green-900 bg-green-950 text-green-300"
                                  : "border-green-200 bg-green-50 text-green-900"
                              }`}
                            >
                              <pre className="whitespace-pre-wrap break-words">
                                {example.output}
                              </pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Mark Complete Button */}
              {isAuthenticated && (
                <Button
                  onClick={handleMarkComplete}
                  disabled={isCompleted}
                  className="w-full h-11 gap-2"
                  variant={isCompleted ? "outline" : "default"}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isCompleted ? "✓ Marked Complete" : "Mark as Complete"}
                </Button>
              )}
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-4">
              {lesson.practiceProblems.length > 0 ? (
                <div className="space-y-4">
                  {lesson.practiceProblems.map((problem, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-1">{problem.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {problem.description}
                          </p>
                        </div>

                        {/* Editor */}
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Your Code
                          </label>
                          <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={problem.language}
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="gap-2 flex-1"
                          >
                            ▶ {isRunning ? "Running..." : "Run Code"}
                          </Button>
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="gap-2"
                          >
                            ↻ Reset
                          </Button>
                          {isAuthenticated && (
                            <Button
                              onClick={() => setShowAI(true)}
                              variant="outline"
                              className="gap-2"
                              disabled={!isAuthenticated}
                            >
                              💡 Hint
                            </Button>
                          )}
                        </div>

                        {/* Output */}
                        {output && (
                          <div
                            ref={responseRef}
                            className={`rounded-lg border p-4 ${
                              dark
                                ? "border-slate-700 bg-slate-800"
                                : "border-gray-200 bg-gray-100"
                            }`}
                          >
                            <div className="mb-2 text-sm font-semibold">Output</div>
                            <ResponsePanel response={output} loading={false} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p>No practice problems yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            {prevLesson ? (
              <Link to={`/lesson/${prevLesson.id}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link to={`/lesson/${nextLesson.id}`} className="flex-1">
                <Button className="w-full gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                Course Complete! 🎉
              </Button>
            )}
          </div>
        </motion.div>

        {/* AI Assistant Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={showAI && isAuthenticated ? "lg:col-span-1" : ""}
        >
          {showAI && isAuthenticated && (
            <AIAssistantPanel
              lesson={lesson}
              course={course}
              onClose={() => setShowAI(false)}
              currentCode={code}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
