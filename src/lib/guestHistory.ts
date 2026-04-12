// Guest Mode History Manager - Persistent localStorage for non-authenticated users

export interface GuestHistoryItem {
  id: string;
  mode: "generate" | "debug" | "explain" | "optimize" | "refactor";
  prompt: string;
  response: string;
  code?: string;
  language?: string;
  timestamp: number;
}

export interface GuestConversation {
  id: string;
  title: string;
  items: GuestHistoryItem[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "aicode_helper_guest_history";
const MAX_ITEMS = 50; // Limit to prevent storage overflow

export const guestHistoryManager = {
  /**
   * Get all guest conversations
   */
  getConversations(): GuestConversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to retrieve guest history:", error);
      return [];
    }
  },

  /**
   * Get a specific conversation by ID
   */
  getConversation(conversationId: string): GuestConversation | null {
    const conversations = this.getConversations();
    return conversations.find((c) => c.id === conversationId) || null;
  },

  /**
   * Create a new conversation
   */
  createConversation(title: string): GuestConversation {
    const conversation: GuestConversation = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const conversations = this.getConversations();
    conversations.unshift(conversation);

    // Keep only recent conversations
    if (conversations.length > MAX_ITEMS) {
      conversations.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return conversation;
  },

  /**
   * Add item to conversation
   */
  addItem(
    conversationId: string,
    mode: GuestHistoryItem["mode"],
    prompt: string,
    response: string,
    code?: string,
    language?: string
  ): GuestHistoryItem {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const item: GuestHistoryItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      prompt,
      response,
      code,
      language,
      timestamp: Date.now(),
    };

    conversation.items.push(item);
    conversation.updatedAt = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return item;
  },

  /**
   * Update conversation title
   */
  updateConversationTitle(conversationId: string, title: string): void {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation) {
      conversation.title = title;
      conversation.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  },

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId: string): void {
    const conversations = this.getConversations();
    const filtered = conversations.filter((c) => c.id !== conversationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  /**
   * Clear all guest history
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Export history as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.getConversations(), null, 2);
  },
};
