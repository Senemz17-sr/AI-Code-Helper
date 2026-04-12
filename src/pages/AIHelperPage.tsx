import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Code2,
  Bug,
  Zap,
  BookOpen,
  RefreshCw,
  Copy,
  Download,
  Upload,
  Plus,
  Trash2,
  Menu,
  X,
  MessageSquare,
  MoreVertical,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GuestModeBanner from "@/components/GuestModeBanner";
import { guestHistoryManager } from "@/lib/guestHistory";
import CodeEditor from "@/components/CodeEditor";

type AIMode = "generate" | "debug" | "explain" | "optimize" | "refactor";
type Language = "python" | "javascript" | "cpp" | "c";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
  language?: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AI_MODES = {
  generate: { label: "Generate", icon: Code2, color: "from-emerald-500 to-cyan-500", desc: "Create new code" },
  debug: { label: "Debug", icon: Bug, color: "from-red-500 to-orange-500", desc: "Fix errors" },
  explain: { label: "Explain", icon: BookOpen, color: "from-blue-500 to-cyan-500", desc: "Understand code" },
  optimize: { label: "Optimize", icon: Zap, color: "from-yellow-500 to-orange-500", desc: "Improve performance" },
  refactor: { label: "Refactor", icon: RefreshCw, color: "from-purple-500 to-pink-500", desc: "Better structure" },
};

const LANGUAGES = ["python", "javascript", "cpp", "c"];

// Typing Animation Component
function TypingAnimation({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, text, speed]);

  return (
    <div className="space-y-2">
      <p className="text-gray-200 leading-relaxed text-sm">{displayedText}</p>
      {!isComplete && (
        <span className="inline-block w-2 h-4 bg-emerald-400 rounded-sm animate-pulse"></span>
      )}
    </div>
  );
}

// Message Component
function Message({ msg, onCopy, onDownload }: { msg: ChatMessage; onCopy: () => void; onDownload: () => void }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-xl ${isUser ? "" : "mr-4"}`}>
        {/* Message Content */}
        <div
          className={`rounded-lg px-4 py-3 transition-all ${
            isUser
              ? "bg-emerald-600 text-white rounded-br-none"
              : "bg-gray-800/80 text-gray-200 rounded-bl-none border border-gray-700/50"
          }`}
        >
          {msg.isTyping ? (
            <TypingAnimation text={msg.content} speed={20} />
          ) : (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          )}
        </div>

        {/* Code Block */}
        {msg.code && !isUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 rounded-lg bg-gray-900/50 border border-gray-700/50 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-400">{msg.language}</span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCopy}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDownload}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Download code"
                >
                  <Download className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                </motion.button>
              </div>
            </div>
            <pre className="text-xs text-gray-300 overflow-x-auto max-h-40">
              <code>{msg.code}</code>
            </pre>
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-2 block">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

// Conversation Item Component
function ConversationItem({
  conv,
  isActive,
  onClick,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-emerald-900/30 border border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : "hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-gray-500"}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">
            {conv.messages[0]?.content?.substring(0, 30) || "New Chat"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(conv.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
        >
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AIHelperPage() {
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [mode, setMode] = useState<AIMode>("generate");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  // Load guest history if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const guestConvs = guestHistoryManager.getConversations();
      if (guestConvs.length > 0) {
        // Convert guest conversations to Chat format for display
        const convertedConvs: Conversation[] = guestConvs.map((gc) => ({
          id: gc.id,
          title: gc.title,
          messages: gc.items.map((item) => ({
            id: item.id,
            role: "user" as const,
            content: item.prompt,
            code: item.code,
            language: item.language as Language,
            timestamp: new Date(item.timestamp),
          })),
          createdAt: new Date(gc.createdAt),
          updatedAt: new Date(gc.updatedAt),
        }));
        setConversations(convertedConvs);
        if (convertedConvs.length > 0) {
          setCurrentConversationId(convertedConvs[0].id);
        }
      }
    }
  }, [isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async () => {
    if (!prompt.trim() && !code.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      code: code || undefined,
      language,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              updatedAt: new Date(),
            }
          : c
      )
    );

    const userPromptText = prompt;
    const userCode = code;
    setPrompt("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(mode, userPromptText, userCode),
        code: generateMockCode(mode, language),
        language,
        timestamp: new Date(),
        isTyping: true,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? { 
                ...c, 
                messages: [...c.messages, aiResponse], 
                updatedAt: new Date() 
              }
            : c
        )
      );

      // Save to guest history if not authenticated  
      if (!isAuthenticated) {
        try {
          guestHistoryManager.addItem(
            currentConversationId,
            mode,
            userPromptText,
            aiResponse.content,
            aiResponse.code,
            language
          );
        } catch (error) {
          console.error("Failed to save to guest history:", error);
        }
      }

      // Remove typing animation after completion
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) => ({ ...m, isTyping: false })),
                }
              : c
          )
        );
      }, 2000);

      setIsLoading(false);
    }, 800);
  };

  const generateMockResponse = (mode: AIMode, prompt: string, code: string) => {
    const responses: Record<AIMode, string> = {
      generate:
        "I've created an efficient " +
        language +
        " function based on your requirements. This implementation follows best practices with proper error handling and clean code structure.",
      debug: "I found 2 potential issues in your code:\n\n1. Line 5: Missing null check before array access\n2. Line 12: Variable scope conflict\n\nHere's the corrected version with explanations:",
      explain:
        "This code performs the following:\n\n1. Initializes the data structure\n2. Iterates through each element\n3. Applies transformation logic\n4. Returns the processed result\n\nKey points: Variables are properly scoped, error handling is in place.",
      optimize:
        "I've optimized your code for better performance:\n\n✓ Reduced time complexity from O(n²) to O(n log n)\n✓ Minimized memory allocation\n✓ Used built-in methods for efficiency\n\nPerformance improvement: ~70% faster execution",
      refactor:
        "I've refactored your code to follow SOLID principles:\n\n✓ Better separation of concerns\n✓ More readable variable names\n✓ Reduced code duplication\n✓ Improved error handling\n\nThe new structure is more maintainable and testable.",
    };
    return responses[mode];
  };

  const generateMockCode = (mode: AIMode, lang: Language) => {
    const codes: Record<AIMode, Record<Language, string>> = {
      generate: {
        python: 'def process_data(items):\n    """Process items efficiently"""\n    result = []\n    for item in items:\n        if item > 0:\n            result.append(item * 2)\n    return result',
        javascript:
          "function processData(items) {\n  return items\n    .filter(item => item > 0)\n    .map(item => item * 2);\n}",
        cpp: "std::vector<int> processData(const std::vector<int>& items) {\n    std::vector<int> result;\n    for (int item : items) {\n        if (item > 0) result.push_back(item * 2);\n    }\n    return result;\n}",
        c: "void processData(int* items, int n, int* result) {\n    for (int i = 0; i < n; i++) {\n        if (items[i] > 0) result[i] = items[i] * 2;\n    }\n}",
      },
      debug: {
        python: "def process_data(items):\n    if not items:\n        return []\n    result = []\n    for item in items:\n        if item is not None and item > 0:\n            result.append(item * 2)\n    return result",
        javascript: "function processData(items) {\n  if (!Array.isArray(items)) return [];\n  return items\n    .filter(item => item != null && item > 0)\n    .map(item => item * 2);\n}",
        cpp:
          "std::vector<int> processData(const std::vector<int>& items) {\n    if (items.empty()) return {};\n    std::vector<int> result;\n    for (int item : items) {\n        if (item > 0) result.push_back(item * 2);\n    }\n    return result;\n}",
        c: "int processData(int* items, int n, int* result) {\n    if (items == NULL || n <= 0) return -1;\n    for (int i = 0; i < n; i++) {\n        if (items[i] > 0) result[i] = items[i] * 2;\n    }\n    return 0;\n}",
      },
      explain: {
        python: "# Input: list of integers\nitems = [1, -2, 3, -4, 5]\n\n# Filter positive values and double them\nresult = [x * 2 for x in items if x > 0]\n\n# Result: [2, 6, 10]",
        javascript: "const items = [1, -2, 3, -4, 5];\nconst result = items\n  .filter(x => x > 0)    // Keep positive\n  .map(x => x * 2);    // Double values\n// Result: [2, 6, 10]",
        cpp: "std::vector<int> items = {1, -2, 3, -4, 5};\nstd::vector<int> result;\nfor (int x : items) {\n    if (x > 0) result.push_back(x * 2);\n}\n// Result: {2, 6, 10}",
        c: "int items[] = {1, -2, 3, -4, 5};\nint result[5];\nint count = 0;\nfor (int i = 0; i < 5; i++) {\n    if (items[i] > 0) {\n        result[count++] = items[i] * 2;\n    }\n}",
      },
      optimize: {
        python: "# Using generator for memory efficiency\ndef process_data(items):\n    return (x * 2 for x in items if x > 0)\n\n# Or use filter + map\nfrom operator import mul\nresult = map(mul, filter(lambda x: x > 0, items), [2]*len(items))",
        javascript:
          "// Optimized one-liner\nconst processData = items => \n  items.filter(x => x > 0).map(x => x * 2);",
        cpp:
          "// STL algorithms for efficiency\nstd::vector<int> processData(std::vector<int> items) {\n    items.erase(std::remove_if(items.begin(), items.end(),\n        [](int x) { return x <= 0; }), items.end());\n    std::for_each(items.begin(), items.end(),\n        [](int& x) { x *= 2; });\n    return items;\n}",
        c: "// Optimized in-place\nvoid processData(int* items, int* size) {\n    int j = 0;\n    for (int i = 0; i < *size; i++) {\n        if (items[i] > 0) {\n            items[j++] = items[i] * 2;\n        }\n    }\n    *size = j;\n}",
      },
      refactor: {
        python: "class DataProcessor:\n    @staticmethod\n    def process(items):\n        \"\"\"Process items with validation.\"\"\"\n        if not isinstance(items, list):\n            raise ValueError('Input must be a list')\n        return [x * 2 for x in items if x > 0]\n\nprocessor = DataProcessor()\nresult = processor.process([1, -2, 3])",
        javascript:
          "class DataProcessor {\n  static process(items) {\n    if (!Array.isArray(items)) {\n      throw new Error('Input must be array');\n    }\n    return items.filter(x => x > 0).map(x => x * 2);\n  }\n}\n\nconst result = DataProcessor.process([1, -2, 3]);",
        cpp:
          "class DataProcessor {\npublic:\n    static std::vector<int> process(const std::vector<int>& items) {\n        std::vector<int> result;\n        std::copy_if(items.begin(), items.end(),\n            std::back_inserter(result),\n            [](int x) { return x > 0; });\n        return result;\n    }\n};\n\nstd::vector<int> result = DataProcessor::process(items);",
        c: "typedef int (*ProcessFunc)(int);\n\nint isPositive(int x) { return x > 0; }\n\nvoid processData(int* items, int* size, ProcessFunc filter) {\n    int j = 0;\n    for (int i = 0; i < *size; i++) {\n        if (filter(items[i])) {\n            items[j++] = items[i] * 2;\n        }\n    }\n    *size = j;\n}",
      },
    };

    return codes[mode][lang] || codes[mode]["python"];
  };

  const handleCopyCode = () => {
    const msg = currentConversation?.messages.find((m) => m.code);
    if (msg?.code) {
      navigator.clipboard.writeText(msg.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCode = () => {
    const msg = currentConversation?.messages.find((m) => m.code);
    if (msg?.code) {
      const element = document.createElement("a");
      const file = new Blob([msg.code], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `code.${msg.language || "txt"}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to guest history if not authenticated
    if (!isAuthenticated) {
      guestHistoryManager.createConversation("New Chat");
    }

    setConversations((prev) => [newChat, ...prev]);
    setCurrentConversationId(newId);
    setCode("");
    setPrompt("");
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));

    // Delete from guest history if not authenticated
    if (!isAuthenticated) {
      guestHistoryManager.deleteConversation(id);
    }

    if (currentConversationId === id && conversations.length > 1) {
      const remaining = conversations.filter((c) => c.id !== id);
      setCurrentConversationId(remaining[0].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-64 border-r border-gray-800/50 bg-gray-900/80 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </motion.button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={currentConversationId === conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    onDelete={() => deleteConversation(conv.id)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800/50 space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
              >
                Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
              >
                Help & Support
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              CodeHelper AI
            </span>
          </motion.div>

          <div className="w-10"></div>
        </div>

        {/* Chat Area & Editor Container */}
        <div className="flex-1 overflow-hidden flex gap-4 p-6">
          {/* Left: Chat Messages */}
          <div className="flex-1 flex flex-col bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden shadow-xl">
            {/* Guest Mode Banner */}
            {!isAuthenticated && (
              <div className="px-6 pt-6">
                <GuestModeBanner />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {currentConversation && currentConversation.messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 mx-auto mb-4"
                    ></motion.div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Start a new conversation</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Select an AI mode, write your prompt, and let the magic happen
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {currentConversation?.messages.map((msg, idx) => (
                      <Message
                        key={msg.id}
                        msg={msg}
                        onCopy={handleCopyCode}
                        onDownload={handleDownloadCode}
                      />
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-2 p-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        ></motion.div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800/50 p-4 space-y-3 bg-gray-900/30 backdrop-blur">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white text-sm focus:border-emerald-500/50 outline-none placeholder-gray-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 text-center">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>

          {/* Right: Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-96 flex flex-col gap-4 max-h-full"
          >
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(AI_MODES) as [
                  AIMode,
                  (typeof AI_MODES)[AIMode]
                ][]
              ).map(([modeKey, modeData]) => (
                <motion.button
                  key={modeKey}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode(modeKey)}
                  className={`relative p-3 rounded-lg border-2 transition-all duration-200 group overflow-hidden ${
                    mode === modeKey
                      ? `border-emerald-500/50 bg-emerald-900/20 shadow-lg shadow-emerald-500/10`
                      : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-800/50"
                  }`}
                >
                  <modeData.icon className={`w-4 h-4 mb-2 ${
                    mode === modeKey ? "text-emerald-400" : "text-gray-400"
                  }`} />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-200">
                      {modeData.label}
                    </div>
                    <div className="text-xs text-gray-500">{modeData.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Language Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white text-sm focus:border-emerald-500/50 outline-none transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden rounded-lg border border-gray-700/50 shadow-lg">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
