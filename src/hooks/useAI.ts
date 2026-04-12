import { useState, useCallback } from "react";
import { useAI } from "@/contexts/AIContext";
import OpenAIService from "@/services/ai/openaiService";
import type { AIMode, Language, AIResponse } from "@/types/ai";

/**
 * useAIHelper - Hook for AI operations
 */
export function useAIHelper() {
  const { aiConfig, setIsLoading, setError } = useAI();
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [openaiService, setOpenaiService] = useState<any>(null);

  useEffect(() => {
    if (aiConfig?.apiKey) {
      const service = OpenAIService.initializeOpenAI(aiConfig.apiKey, {
        model: aiConfig.model || "gpt-3.5-turbo",
        temperature: aiConfig.temperature || 0.7,
        maxTokens: aiConfig.maxTokens || 2048,
      });
      setOpenaiService(service);
    }
  }, [aiConfig]);

  const generateCode = useCallback(
    async (prompt: string, language: Language, context?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        const mockResponse: AIResponse = {
          id: Date.now().toString(),
          code: `# Generated ${language} code\nprint("Hello World")`,
          explanation: "This is a simple generated code example.",
        };
        setResponse(mockResponse);
        return mockResponse;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Generation failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  const debugCode = useCallback(
    async (code: string, language: Language, description?: string) => {
      if (!openaiService) throw new Error("OpenAI service not initialized. Add your API key.");
      setIsLoading(true);
      setError(null);
      try {
        const result = await openaiService.debugCode(code, language, description);
        setResponse(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Debug failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [openaiService, setIsLoading, setError]
  );

  const explainCode = useCallback(
    async (code: string, language: Language) => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        const mockResponse: AIResponse = {
          id: Date.now().toString(),
          code: code,
          explanation: "This code does the following:\n1. Step 1\n2. Step 2",
        };
        setResponse(mockResponse);
        return mockResponse;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Explain failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  const optimizeCode = useCallback(
    async (code: string, language: Language) => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        const mockResponse: AIResponse = {
          id: Date.now().toString(),
          code: code,
          explanation:
            "Optimization suggestions:\n1. Use caching\n2. Reduce iterations",
        };
        setResponse(mockResponse);
        return mockResponse;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Optimization failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  const refactorCode = useCallback(
    async (code: string, language: Language) => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        const mockResponse: AIResponse = {
          id: Date.now().toString(),
          code: code,
          explanation: "Refactored to follow SOLID principles.",
        };
        setResponse(mockResponse);
        return mockResponse;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Refactor failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  const executeMode = useCallback(
    async (
      mode: AIMode,
      code: string,
      prompt: string,
      language: Language
    ) => {
      switch (mode) {
        case "generate":
          return generateCode(prompt, language);
        case "debug":
          return debugCode(code, language, prompt);
        case "explain":
          return explainCode(code, language);
        case "optimize":
          return optimizeCode(code, language);
        case "refactor":
          return refactorCode(code, language);
        default:
          throw new Error(`Unknown mode: ${mode}`);
      }
    },
    [generateCode, debugCode, explainCode, optimizeCode, refactorCode]
  );

  return {
    response,
    generateCode,
    debugCode,
    explainCode,
    optimizeCode,
    refactorCode,
    executeMode,
  };
}

/**
 * useFileUpload - Hook for file upload and parsing
 */
export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (uploadedFile.size > maxSize) {
      setError("File too large. Max 5MB.");
      return false;
    }

    const supportedExtensions = [
      ".py",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".cpp",
      ".c",
      ".h",
      ".txt",
      ".json",
    ];
    const fileName = uploadedFile.name;
    const hasValidExtension = supportedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError(
        `Unsupported file type. Supported: ${supportedExtensions.join(", ")}`
      );
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      setFile(uploadedFile);
      setError(null);
    };

    reader.onerror = () => {
      setError("Failed to read file");
    };

    reader.readAsText(uploadedFile);
    return true;
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setContent("");
    setError(null);
  }, []);

  const detectLanguage = (filename: string): Language => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const languageMap: Record<string, Language> = {
      py: "python",
      js: "javascript",
      jsx: "javascript",
      ts: "javascript",
      tsx: "javascript",
      cpp: "cpp",
      c: "c",
      h: "cpp",
    };
    return (languageMap[extension] || "python") as Language;
  };

  return {
    file,
    content,
    error,
    handleFileUpload,
    clearFile,
    detectLanguage,
  };
}

/**
 * useChatHistory - Hook for managing chat history
 */
export function useChatHistory() {
  const {
    conversations,
    currentConversation,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    clearMessages,
  } = useAI();

  const getRecentChats = useCallback(
    (limit = 10) => {
      return conversations.slice(0, limit);
    },
    [conversations]
  );

  const searchChats = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(lowercaseQuery) ||
          c.messages.some((m) =>
            m.content.toLowerCase().includes(lowercaseQuery)
          )
      );
    },
    [conversations]
  );

  const exportConversation = useCallback((conversationId: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return null;

    return JSON.stringify(
      {
        title: conv.title,
        language: conv.language,
        messages: conv.messages,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [conversations]);

  return {
    conversations,
    currentConversation,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    clearMessages,
    getRecentChats,
    searchChats,
    exportConversation,
  };
}
