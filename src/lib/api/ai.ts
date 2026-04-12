import { supabase } from "@/integrations/supabase/client";
import type { Conversation } from "@/types/ai";

export interface SaveHistoryRequest {
  conversations: Conversation[];
}

export async function saveAIHistory(conversations: Conversation[]): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("ai_conversations")
      .upsert({ 
        user_id: user.id, 
        conversations: conversations 
      });

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(`Failed to save history: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getAIHistory(): Promise<Conversation[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("conversations")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error; // No rows OK for guest
    return data?.conversations || [];
  } catch (error) {
    throw new Error(`Failed to get history: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
