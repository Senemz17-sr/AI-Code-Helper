/**
 * FRONTEND GUEST MODE IMPLEMENTATION GUIDE
 * 
 * This document outlines the complete refactoring for guest mode support
 */

// ========================================
// 1. GUEST HISTORY MANAGER (localStorage)
// ========================================

// File: src/lib/guestHistory.ts
// Usage:
import { guestHistoryManager } from '@/lib/guestHistory';

// Create a new conversation
const newConv = guestHistoryManager.createConversation('My First Chat');

// Add an item to conversation
guestHistoryManager.addItem(
  conversationId,
  'generate', // mode
  'Create a function that...', // prompt
  'Here is the generated code...', // response
  'function foo() { ... }', // code
  'javascript' // language
);

// Get all conversations
const allConversations = guestHistoryManager.getConversations();

// Get specific conversation
const conversation = guestHistoryManager.getConversation(conversationId);

// Update conversation title
guestHistoryManager.updateConversationTitle(conversationId, 'New Title');

// Delete conversation
guestHistoryManager.deleteConversation(conversationId);

// Export as JSON
const exportedData = guestHistoryManager.exportAsJSON();

// Clear all guest history
guestHistoryManager.clearAll();


// ========================================
// 2. GUEST MODE BANNER COMPONENT
// ========================================

// File: src/components/GuestModeBanner.tsx
// Usage in any component:

import GuestModeBanner from '@/components/GuestModeBanner';

export default function SomeComponent() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Show banner only if not authenticated */}
      {!isAuthenticated && <GuestModeBanner />}
      
      {/* Rest of your component */}
    </div>
  );
}


// ========================================
// 3. UPDATED AI HELPER PAGE
// ========================================

// File: src/pages/AIHelperPage.tsx
// Key changes:

import { useAuth } from '@/contexts/AuthContext';
import { guestHistoryManager } from '@/lib/guestHistory';
import GuestModeBanner from '@/components/GuestModeBanner';

export default function AIHelperPage() {
  // Get auth state - no redirects, user can continue
  const { isAuthenticated, user } = useAuth();

  // ... component code ...

  // Load guest history on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const guestConversations = guestHistoryManager.getConversations();
      // Convert and load conversations
    }
  }, [isAuthenticated]);

  // Create new chat - with guest history support
  const createNewChat = () => {
    if (!isAuthenticated) {
      guestHistoryManager.createConversation('New Chat');
    }
    // ... create chat UI ...
  };

  // Delete chat - with guest history support
  const deleteConversation = (id: string) => {
    if (!isAuthenticated) {
      guestHistoryManager.deleteConversation(id);
    }
    // ... delete UI ...
  };

  // Send message - with guest history saving
  const handleSendMessage = async () => {
    // ... generate AI response ...

    if (!isAuthenticated) {
      // Save to localStorage
      guestHistoryManager.addItem(
        currentConversationId,
        mode,
        userPrompt,
        aiResponse,
        generatedCode,
        selectedLanguage
      );
    } else {
      // Save to database via API
      await fetch('/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          mode,
          prompt: userPrompt,
          response: aiResponse,
          code: generatedCode,
          language: selectedLanguage,
        }),
      });
    }
  };

  // Render with guest banner
  return (
    <div>
      {!isAuthenticated && <GuestModeBanner />}
      
      {/* Rest of AI Helper UI */}
    </div>
  );
}


// ========================================
// 4. API CLIENT UTILITIES
// ========================================

// File: src/lib/api/ai.ts

export class AIClient {
  private baseURL = '/api/ai';

  constructor(private token?: string) {}

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Generate code - PUBLIC endpoint, no auth needed
   */
  async generateCode(prompt: string, language: string, context?: string) {
    return this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, language, context }),
    });
  }

  /**
   * Debug code - PUBLIC endpoint, no auth needed
   */
  async debugCode(code: string, language: string) {
    return this.request('/debug', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }

  /**
   * Explain code - PUBLIC endpoint, no auth needed
   */
  async explainCode(code: string, language: string) {
    return this.request('/explain', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }

  /**
   * Optimize code - PUBLIC endpoint, no auth needed
   */
  async optimizeCode(code: string, language: string) {
    return this.request('/optimize', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }

  /**
   * Refactor code - PUBLIC endpoint, no auth needed
   */
  async refactorCode(code: string, language: string) {
    return this.request('/refactor', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }
}


// ========================================
// 5. HISTORY API CLIENT
// ========================================

// File: src/lib/api/history.ts

export class HistoryClient {
  private baseURL = '/api/history';

  constructor(private token: string) {
    if (!token) {
      throw new Error('History API requires authentication');
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      ...options?.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Save history item - Requires auth
   */
  async saveItem(data: {
    conversationId: string;
    mode: string;
    prompt: string;
    response: string;
    code?: string;
    language?: string;
  }) {
    return this.request('/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get history - Requires auth
   */
  async getHistory(conversationId?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (conversationId) params.append('conversationId', conversationId);
    params.append('limit', String(limit));
    params.append('offset', String(offset));

    return this.request(`?${params.toString()}`);
  }

  /**
   * Delete history item - Requires auth
   */
  async deleteItem(itemId: string) {
    return this.request(`/${itemId}`, { method: 'DELETE' });
  }
}


// ========================================
// 6. USAGE IN REACT COMPONENTS
// ========================================

// Example: Using AI Client in a component

import { useAuth } from '@/contexts/AuthContext';
import { AIClient } from '@/lib/api/ai';
import { HistoryClient } from '@/lib/api/history';
import { guestHistoryManager } from '@/lib/guestHistory';

export default function CodeGeneratorComponent() {
  const { isAuthenticated, session } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      // Use public AI endpoint (no auth needed)
      const aiClient = new AIClient();
      const response = await aiClient.generateCode(prompt, 'javascript');
      
      setResult(response.data.code);

      // Save to history based on auth status
      if (isAuthenticated && session?.tokens.accessToken) {
        // Save to database
        const historyClient = new HistoryClient(session.tokens.accessToken);
        await historyClient.saveItem({
          conversationId: 'default',
          mode: 'generate',
          prompt,
          response: JSON.stringify(response.data),
          code: response.data.code,
          language: 'javascript',
        });
      } else {
        // Save to localStorage
        guestHistoryManager.addItem(
          'default',
          'generate',
          prompt,
          JSON.stringify(response.data),
          response.data.code,
          'javascript'
        );
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && <pre>{result}</pre>}
    </div>
  );
}


// ========================================
// 7. CONDITIONAL AUTH IN APP.TSX
// ========================================

// Before (Restricted):
<Route
  path="/helper"
  element={
    <ProtectedRoute>
      <AIHelperPage />
    </ProtectedRoute>
  }
/>

// After (Open to guests):
<Route path="/helper" element={<AIHelperPage />} />


// ========================================
// 8. STORAGE MIGRATION (DB SYNC)
// ========================================

// When user logs in, migrate localStorage to database:

export async function migrateGuestHistoryToDatabase(
  token: string,
  userId: string
) {
  try {
    const guestConversations = guestHistoryManager.getConversations();

    for (const conv of guestConversations) {
      // Create conversation in DB
      const convResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: conv.title }),
      });

      const dbConv = await convResponse.json();

      // Migrate history items
      for (const item of conv.items) {
        await fetch('/api/history/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId: dbConv.data.id,
            mode: item.mode,
            prompt: item.prompt,
            response: item.response,
            code: item.code,
            language: item.language,
          }),
        });
      }
    }

    // Clear guest history after successful migration
    guestHistoryManager.clearAll();
    
    console.log('Guest history migrated successfully');
  } catch (error) {
    console.error('Failed to migrate history:', error);
  }
}

// Call this in AuthContext after successful login
const login = async (email: string, password: string) => {
  // ... existing login logic ...
  
  // Migrate guest history if any
  if (currentUser.id && session.tokens.accessToken) {
    await migrateGuestHistoryToDatabase(
      session.tokens.accessToken,
      currentUser.id
    );
  }
};


// ========================================
// 9. RATE LIMITING CONSIDERATIONS
// ========================================

// Public endpoints (no auth):
// - 30 requests per 15 minutes per IP
// - Displayed in UI: "You've used X of 30 requests"

// Authenticated endpoints:
// - 100 requests per 15 minutes per user
// - No rate limit warnings

// Show rate limit warning:

export function useRateLimitWarning() {
  const [remaining, setRemaining] = useState<number | null>(null);

  const updateFromResponse = (response: Response) => {
    const limit = response.headers.get('X-RateLimit-Limit');
    const current = response.headers.get('X-RateLimit-Current');

    if (limit && current) {
      setRemaining(parseInt(limit) - parseInt(current));
    }
  };

  return { remaining, updateFromResponse };
}

// Usage in component:
const { remaining, updateFromResponse } = useRateLimitWarning();

// After API call:
const response = await fetch('/api/ai/generate', {...});
updateFromResponse(response);

if (remaining !== null && remaining < 5) {
  showWarning(`Only ${remaining} requests remaining`);
}
