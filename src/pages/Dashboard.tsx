import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, Bug, Zap, BookOpen, TrendingUp, Award } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ResponsePanel from "@/components/ResponsePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { saveQuery } from "@/lib/history";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { COURSES } from "@/data/courses";
import { ArrowRight } from "lucide-react";

const LANGUAGES = ["python", "javascript", "c", "c++"] as const;
type ActionType = "explain" | "fix" | "optimize";

const actions: { type: ActionType; label: string; icon: typeof Code2 }[] = [
  { type: "explain", label: "Explain Code", icon: Code2 },
  { type: "fix", label: "Fix Errors", icon: Bug },
  { type: "optimize", label: "Optimize Code", icon: Zap },
];

async function streamAnalysis(
  code: string,
  language: string,
  action: ActionType,
  onDelta: (text: string) => void,
  onDone: () => void,
) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-code`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ code, language, action }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `Error ${resp.status}`);
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  onDone();
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("learning");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>("python");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAction = async (action: ActionType) => {
    if (!code.trim()) return;
    setLoading(true);
    setResponse("");

    let fullResponse = "";

    try {
      await streamAnalysis(
        code,
        language,
        action,
        (chunk) => {
          fullResponse += chunk;
          setResponse(fullResponse);
        },
        () => {
          setLoading(false);
          if (fullResponse) {
            saveQuery({ code_input: code, language, action_type: action, ai_response: fullResponse });
          }
        },
      );
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Mock data for enrolled courses
  const enrolledCourses = COURSES.filter(c => c.enabled).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-6xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Your learning hub and code analysis tool
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("learning")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "learning"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Learning Progress
          </button>
          <button
            onClick={() => setActiveTab("helper")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "helper"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-4 w-4" />
            Code Helper
          </button>
        </div>

        {/* Learning Tab */}
        {activeTab === "learning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: BookOpen, label: "Courses Enrolled", value: enrolledCourses.length },
                { icon: TrendingUp, label: "Overall Progress", value: "0%" },
                { icon: Award, label: "Certificates Earned", value: "0" },
                { icon: Zap, label: "Learning Streak", value: "0 days" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="mb-4 text-xl font-bold">Your Courses</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {enrolledCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link to={`/course/${course.id}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all h-full">
                        <CardHeader>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">0%</span>
                          </div>
                          <Progress value={0} />
                          <div className="flex gap-2 text-xs">
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                              {course.chapters} chapters
                            </span>
                            <span className="rounded-full bg-secondary px-2 py-1">
                              {course.level}
                            </span>
                          </div>
                          <Button size="sm" className="w-full group-hover:gap-2">
                            Continue
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <Link to="/courses">
                  <Button variant="outline">Explore More Courses</Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Code Helper Tab */}
        {activeTab === "helper" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-sm text-muted-foreground">
              Paste your code, pick a language, and choose an action.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-fit rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>

                <CodeEditor value={code} onChange={setCode} language={language} />

                <div className="flex flex-wrap gap-2">
                  {actions.map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => handleAction(type)}
                      disabled={loading || !code.trim()}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <ResponsePanel response={response} loading={loading} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
