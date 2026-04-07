import { useState, useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getLessonById, getLessonsByCourse, getCourseById } from "@/data/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Code2,
  RotateCcw,
  Play,
  Zap,
  Lock,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ResponsePanel from "@/components/ResponsePanel";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { useTheme } from "@/hooks/useTheme";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const course = lesson ? getCourseById(lesson.courseId) : undefined;
  const lessons = lesson ? getLessonsByCourse(lesson.courseId) : [];
  const { dark } = useTheme();

  const [activeTab, setActiveTab] = useState<"lesson" | "practice">("lesson");
  const [code, setCode] = useState<string>(
    lesson?.practiceProblems[0]?.template || ""
  );
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showAI, setShowAI] = useState(false);
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

      const text = await response.text();
      setOutput(text || "Code executed successfully!");
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(
      lesson.practiceProblems[0]?.template ||
        `// Reset your code here`
    );
    setOutput("");
  };

  return (
    <div className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`border-b ${
          dark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
        } sticky top-0 z-40`}
      >
        <div className="container flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to={`/course/${course.id}`}
              className="text-sm text-primary hover:underline"
            >
              ← {course.title}
            </Link>
            <span className="text-muted-foreground">|</span>
            <h1 className="font-semibold">
              Chapter {lesson.chapter}: {lesson.title}
            </h1>
          </div>
          <Button
            variant={showAI ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </div>

      <div className="container grid gap-6 px-4 py-8 lg:grid-cols-3">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-2 space-y-6`}
        >
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="lesson" className="gap-2">
                <FileText className="h-4 w-4" />
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
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div
                      className="space-y-4 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: lesson.content
                          .split("\n")
                          .map((line) => {
                            if (line.startsWith("#")) return `<h2>${line.replace(/#+ /, "")}</h2>`;
                            if (line.startsWith("##")) return `<h3>${line.replace(/##+ /, "")}</h3>`;
                            if (line.startsWith("-"))
                              return `<li>${line.replace(/^- /, "")}</li>`;
                            return `<p>${line}</p>`;
                          })
                          .join("")
                          .replace(/<li>/g, "<ul><li>")
                          .replace(/<\/li>(?!.*<li>)/g, "</li></ul>"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Code Examples */}
              {lesson.codeExamples.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Code Examples</h2>
                  {lesson.codeExamples.map((example, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{example.title}</CardTitle>
                        {example.explanation && (
                          <CardDescription>{example.explanation}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div
                          className={`rounded-lg border ${
                            dark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"
                          } p-4 font-mono text-sm overflow-x-auto`}
                        >
                          <pre className="text-sm">{example.code}</pre>
                        </div>
                        {example.output && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold">Output:</div>
                            <div
                              className={`rounded-lg border ${
                                dark
                                  ? "border-green-900 bg-green-950 text-green-300"
                                  : "border-green-200 bg-green-50 text-green-900"
                              } p-3 font-mono text-sm`}
                            >
                              <pre>{example.output}</pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-4">
              {lesson.practiceProblems.length > 0 ? (
                <div className="space-y-4">
                  {lesson.practiceProblems.map((problem, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-lg">{problem.title}</CardTitle>
                        <CardDescription>{problem.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Editor */}
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Your Code:
                          </label>
                          <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={problem.language}
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2">
                          <Button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="gap-2 flex-1"
                          >
                            <Play className="h-4 w-4" />
                            {isRunning ? "Running..." : "Run Code"}
                          </Button>
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                          </Button>
                          <Button
                            onClick={() => setShowAI(true)}
                            variant="outline"
                            className="gap-2"
                          >
                            <Zap className="h-4 w-4" />
                            Ask AI
                          </Button>
                        </div>

                        {/* Output */}
                        {output && (
                          <div
                            ref={responseRef}
                            className={`rounded-lg border ${
                              dark
                                ? "border-slate-700 bg-slate-800"
                                : "border-gray-200 bg-gray-100"
                            } p-4`}
                          >
                            <div className="mb-2 text-sm font-semibold">Output:</div>
                            <ResponsePanel
                              response={output}
                              loading={false}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p>No practice problems available yet.</p>
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
                  Previous: {prevLesson.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link to={`/lesson/${nextLesson.id}`} className="flex-1">
                <Button className="w-full gap-2">
                  Next: {nextLesson.title}
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
        {showAI && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <AIAssistantPanel
              lesson={lesson}
              course={course}
              onClose={() => setShowAI(false)}
              currentCode={code}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
