import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Loader2, Zap, HelpCircle, Code, AlertCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { Lesson, Course } from "@/types/course";

interface AIAssistantPanelProps {
  lesson: Lesson;
  course: Course;
  onClose: () => void;
  currentCode: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: HelpCircle,
    label: "Explain This Lesson",
    prompt: "Can you explain this lesson in simpler terms?",
  },
  {
    icon: Code,
    label: "Debug My Code",
    prompt: "Help me debug this code:",
  },
  {
    icon: AlertCircle,
    label: "I'm Stuck",
    prompt: "I don't understand this concept. Can you help?",
  },
  {
    icon: Zap,
    label: "Tips & Tricks",
    prompt: "Give me some tips to improve my code",
  },
];

async function streamAIResponse(
  prompt: string,
  context: string,
  onDelta: (text: string) => void,
  onDone: () => void
) {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-code`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        code: context,
        language: "javascript",
        action: "explain",
        customPrompt: prompt,
      }),
    });

    if (!response.ok) throw new Error("Failed to get response");
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (part) onDelta(part);
      }
    }

    if (buffer) onDelta(buffer);
    onDone();
  } catch (error) {
    onDelta(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    onDone();
  }
}

export default function AIAssistantPanel({
  lesson,
  course,
  onClose,
  currentCode,
}: AIAssistantPanelProps) {
  const { dark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const prompt = customPrompt || input;
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Stream response
    let fullResponse = "";
    await streamAIResponse(
      prompt,
      currentCode || lesson.codeExamples[0]?.code || "",
      (delta) => {
        fullResponse += delta;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullResponse,
          };
          return updated;
        });
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`sticky top-20 rounded-2xl border ${
        dark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"
      } shadow-xl overflow-hidden flex flex-col h-[600px]`}
    >
      {/* Header */}
      <div
        className={`border-b ${dark ? "border-slate-700" : "border-gray-200"} flex items-center justify-between p-4`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              Ask anything about this lesson
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-3 ${
          dark ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Zap className="h-12 w-12 text-primary/30 mb-3" />
            <p className="text-sm text-muted-foreground text-center mb-6">
              Hi! I'm your AI coding assistant. Ask me anything about this lesson or
              your code!
            </p>
            <div className="w-full space-y-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSendMessage(prompt.prompt)}
                  className={`w-full text-left text-xs p-2 rounded-lg transition-colors ${
                    dark
                      ? "hover:bg-slate-800 bg-slate-800/50 text-slate-300"
                      : "hover:bg-gray-100 bg-gray-100 text-gray-700"
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <prompt.icon className="h-3 w-3" />
                    {prompt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-xs ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : dark
                      ? "bg-slate-800 text-slate-100"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`rounded-lg px-3 py-2 flex items-center gap-2 ${
                    dark ? "bg-slate-800" : "bg-gray-200"
                  }`}
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div
        className={`border-t ${dark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"} p-4 space-y-2`}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSendMessage();
            }
          }}
          placeholder="Ask a question... (Ctrl+Enter)"
          className="min-h-[60px] text-xs resize-none"
          disabled={isLoading}
        />
        <Button
          size="sm"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="h-3 w-3" />
              Send
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
