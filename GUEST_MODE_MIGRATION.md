/**
 * GUEST TO AUTHENTICATED MIGRATION EXAMPLE
 * 
 * Complete flow: Guest uses app → Signs in → Data migrates to database
 */

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { guestHistoryManager } from "@/lib/guestHistory";

/**
 * Migration Function
 * Call this when user signs in
 */
export async function migrateGuestDataToDatabase(token: string) {
  try {
    console.log("🔄 Starting guest data migration...");

    const guestConversations = guestHistoryManager.getConversations();

    if (guestConversations.length === 0) {
      console.log("ℹ️  No guest data to migrate");
      return;
    }

    console.log(`📦 Found ${guestConversations.length} conversations to migrate`);

    for (const guestConv of guestConversations) {
      try {
        // Step 1: Create conversation in database
        console.log(`📝 Creating conversation: "${guestConv.title}"`);

        const convResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: guestConv.title,
          }),
        });

        if (!convResponse.ok) {
          throw new Error(`Failed to create conversation: ${convResponse.status}`);
        }

        const { data: dbConversation } = await convResponse.json();
        console.log(`✅ Conversation created with ID: ${dbConversation.id}`);

        // Step 2: Migrate all items in this conversation
        console.log(
          `📤 Migrating ${guestConv.items.length} items from guest storage...`
        );

        for (const item of guestConv.items) {
          const historyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/history/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              conversationId: dbConversation.id,
              mode: item.mode,
              prompt: item.prompt,
              response: item.response,
              code: item.code,
              language: item.language,
            }),
          });

          if (!historyResponse.ok) {
            console.warn(`⚠️  Failed to save history item: ${item.id}`);
            continue;
          }

          console.log(
            `✅ Saved: ${item.mode} - ${item.prompt.substring(0, 30)}...`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error migrating conversation "${guestConv.title}":`,
          error
        );
        // Continue with next conversation
      }
    }

    // Step 3: Clear guest history after successful migration
    console.log("🧹 Clearing guest storage...");
    guestHistoryManager.clearAll();

    console.log("✨ Migration complete!");
    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

/**
 * Hook to handle migration when user authenticates
 */
export function useMigrateOnLogin() {
  const { isAuthenticated, session } = useAuth();

  useEffect(() => {
    const performMigration = async () => {
      // Only migrate when user just authenticated
      if (isAuthenticated && session?.tokens.accessToken) {
        try {
          console.log("🔐 User authenticated, starting migration...");
          await migrateGuestDataToDatabase(session.tokens.accessToken);
        } catch (error) {
          console.error("Migration error:", error);
          // Don't break the app if migration fails
          // User can still use authenticated features
        }
      }
    };

    performMigration();
  }, [isAuthenticated, session?.tokens.accessToken]);
}

/**
 * Updated AuthContext with migration
 * 
 * Add this to your signup function:
 */

// In src/contexts/AuthContext.tsx

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signup = async (email: string, username: string, password: string) => {
    try {
      setIsLoading(true);

      // Existing signup logic...
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Signup failed");

      // Create user profile
      await supabase.from("user_profiles").insert({
        user_id: authData.user.id,
        username,
        xp_points: 0,
        level: 1,
        learning_streak: 0,
      });

      // NEW: Migrate guest data to database
      console.log("🔄 Migrating guest data...");
      if (authData.session?.access_token) {
        try {
          await migrateGuestDataToDatabase(authData.session.access_token);
        } catch (migrationError) {
          console.warn("Migration warning (non-critical):", migrationError);
          // Don't fail signup if migration fails
        }
      }

      // Update local state
      const currentUser: User = {
        id: authData.user.id,
        email: authData.user.email || "",
        username,
        role: "student",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(currentUser);

      toast({
        title: "Success",
        description: "Account created and previous history imported!",
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Existing login logic...
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user || !data.session) throw new Error("Login failed");

      // NEW: Migrate guest data if any
      console.log("🔄 Checking for guest data to migrate...");
      if (data.session.access_token) {
        try {
          await migrateGuestDataToDatabase(data.session.access_token);
        } catch (migrationError) {
          console.warn("Migration warning (non-critical):", migrationError);
          // Don't fail login if migration fails
        }
      }

      // Update state...
      setUser(currentUser);
      setSession({ ... });

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of AuthProvider ...
}

/**
 * SCENARIO 1: Guest User Flow
 * 
 * 1. User visits /helper
 * 2. Not authenticated
 * 3. Can use all AI features
 * 4. Data saved to localStorage
 * 5. GuestModeBanner shown
 * 
 * Storage example:
 * {
 *   "aicode_helper_guest_history": [
 *     {
 *       "id": "guest_1712934234_abc123",
 *       "title": "API Generation",
 *       "items": [
 *         {
 *           "id": "item_1712934234_xyz789",
 *           "mode": "generate",
 *           "prompt": "Create a REST API",
 *           "response": "Here's a basic REST API...",
 *           "code": "app.post('/api/users', ...)",
 *           "language": "javascript",
 *           "timestamp": 1712934234000
 *         }
 *       ],
 *       "createdAt": 1712934234000,
 *       "updatedAt": 1712934234000
 *     }
 *   ]
 * }
 */

/**
 * SCENARIO 2: Guest Signs Up
 * 
 * 1. Guest clicks "Sign In"
 * 2. Fills signup form
 * 3. Clicks "Create Account"
 * 4. Back end creates user
 * 5. Front end calls migrateGuestDataToDatabase()
 * 6. Guest data copied to tables: conversations, history
 * 7. localStorage cleared
 * 8. User redirected to /helper
 * 9. Authenticated mode active
 * 10. Can see previous conversations
 * 11. New interactions saved to database
 * 
 * Database example:
 * conversations table:
 * {
 *   "id": "conv_uuid",
 *   "user_id": "user_uuid",
 *   "title": "API Generation",
 *   "created_at": "2024-04-12T10:30:34Z",
 *   "updated_at": "2024-04-12T10:30:34Z"
 * }
 * 
 * history table:
 * {
 *   "id": "hist_uuid",
 *   "user_id": "user_uuid",
 *   "conversation_id": "conv_uuid",
 *   "mode": "generate",
 *   "prompt": "Create a REST API",
 *   "response": "Here's a basic REST API...",
 *   "code": "app.post('/api/users', ...)",
 *   "language": "javascript",
 *   "created_at": "2024-04-12T10:30:34Z"
 * }
 */

/**
 * SCENARIO 3: Existing User Logs In (No Guest Data)
 * 
 * 1. User clicks "Sign In"
 * 2. Enters credentials
 * 3. Authenticated successfully
 * 4. migrateGuestDataToDatabase() called
 * 5. No guest data found in localStorage ✓
 * 6. Migration completes instantly
 * 7. Authenticated mode active
 * 8. Can see previous database history
 * 9. New interactions saved to database
 */

/**
 * SCENARIO 4: Error Handling During Migration
 * 
 * Network error while creating conversation:
 * - Log warning
 * - Continue with next item
 * - User still authenticated
 * - Some data may not migrate (marked with ⚠️)
 * 
 * User can manually retry:
 * - Clear guest history
 * - Contact support
 * - Try Migration again on next login
 */

/**
 * USAGE IN COMPONENT
 */

export default function AIHelperPage() {
  // Automatically migrate on login
  useMigrateOnLogin();

  // ... rest of component ...

  return (
    <div>
      {/* Guest banner for unauthenticated users */}
      {/* History loaded based on auth status */}
      {/* All interactions auto-saved appropriately */}
    </div>
  );
}

/**
 * DEBUGGING
 * 
 * Check guest data:
 * console.log(guestHistoryManager.getConversations())
 * 
 * Manually trigger migration:
 * await migrateGuestDataToDatabase(YOUR_TOKEN)
 * 
 * Clear guest data:
 * guestHistoryManager.clearAll()
 * 
 * Export guest data:
 * console.log(guestHistoryManager.exportAsJSON())
 */
