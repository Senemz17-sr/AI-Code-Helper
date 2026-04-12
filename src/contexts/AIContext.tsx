import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveAIHistory, getAIHistory } from "@/lib/api/ai";
import type {
  Conversation,
  ChatMessage,
  AIMode,
  Language,
  Project,
  CodeFile,
  AIConfig,
} from "@/types/ai";
// import { debounce } from "lodash";

interface AIContextType {
  // Conversations
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (id: string) => void;
  createConversation: (language: Language, title?: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  // Messages
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string, code?: string) => void;
  clearMessages: (conversationId: string) => void;
  
  // Projects
  projects: Project[];
  createProject: (title: string, description?: string) => void;
  deleteProject: (id: string) => void;
  addFileToProject: (projectId: string, file: CodeFile) => void;
  removeFileFromProject: (projectId: string, fileId: string) => void;
  
  // AI Config
  aiConfig: AIConfig | null;
  setAPIKey: (key: string, provider: string) => void;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  ) || null;

  // Persistence
  const isGuest = !isAuthenticated;
  const STORAGE_KEY = "ai_conversations_guest";

  const loadConversations = useCallback(async () => {
    try {
      if (isGuest) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Conversation[];
          setConversations(parsed);
        }
      } else if (user) {
        const history = await getAIHistory();
        setConversations(history);
      }
    } catch (e) {
      console.error("Load conversations error:", e);
    }
  }, [isGuest, user]);

  const saveConversations = useCallback(async () => {
    try {
      if (isGuest) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } else if (user) {
        await saveAIHistory(conversations);
      }
    } catch (e) {
      console.error("Save conversations error:", e);
    }
  }, [conversations, isGuest, user]);

  const debouncedSave = useCallback(() => {
    const timeout = setTimeout(saveConversations, 1000);
    return () => clearTimeout(timeout);
  }, [saveConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (conversations.length > 0) {
      debouncedSave();
    }
  }, [conversations, debouncedSave]);

  const createConversation = useCallback(
    (language: Language, title?: string) => {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title || `New Chat - ${language}`,
        messages: [],
        language,
        model: "gpt-3.5-turbo",
        isPublic: false,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user?.id || "guest",
      };

      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
    },
    [user?.id]
  );

  const setCurrentConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setCurrentConversationId(remaining[0]?.id || null);
    }
  }, [currentConversationId, conversations]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date() } : c
      )
    );
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    if (!currentConversationId) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              updatedAt: new Date(),
            }
          : c
      )
    );
  }, [currentConversationId]);

  const updateLastMessage = useCallback(
    (content: string, code?: string) => {
      if (!currentConversationId) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversationId && c.messages.length > 0) {
            const messages = [...c.messages];
            const lastMessage = { ...messages[messages.length - 1] };
            lastMessage.content = content;
            if (code) lastMessage.code = code;
            messages[messages.length - 1] = lastMessage;
            return { ...c, messages, updatedAt: new Date() };
          }
          return c;
        })
      );
    },
    [currentConversationId]
  );

  const clearMessages = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [], updatedAt: new Date() }
          : c
      )
    );
  }, []);

  const createProject = useCallback(
    (title: string, description?: string) => {
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        files: [],
        tags: [],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "current-user",
      };

      setProjects((prev) => [newProject, ...prev]);
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addFileToProject = useCallback((projectId: string, file: CodeFile) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, files: [...p.files, file], updatedAt: new Date() }
          : p
      )
    );
  }, []);

  const removeFileFromProject = useCallback(
    (projectId: string, fileId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                files: p.files.filter((f) => f.id !== fileId),
                updatedAt: new Date(),
              }
            : p
        )
      );
    },
    []
  );

  const setAPIKey = useCallback(
    (key: string, provider: string) => {
      setAIConfig((prev) => ({
        ...prev,
        apiKey: key,
        provider: provider as "openai" | "anthropic" | "google",
      } as AIConfig));
      // Store in secure storage (e.g., localStorage with encryption)
    },
    []
  );

  const updateAIConfig = useCallback((config: Partial<AIConfig>) => {
    setAIConfig((prev) => (prev ? { ...prev, ...config } : null));
  }, []);

  const value: AIContextType = {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    updateLastMessage,
    clearMessages,
    projects,
    createProject,
    deleteProject,
    addFileToProject,
    removeFileFromProject,
    aiConfig,
    setAPIKey,
    updateAIConfig,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
