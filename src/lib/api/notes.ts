import { supabase } from "@/integrations/supabase/client";
import { Note, NoteCreateInput, NoteUpdateInput, AIAnalysisResult } from "@/types/notes";

export const noteService = {
  // Create a new note
  async createNote(input: NoteCreateInput): Promise<Note> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_notes")
        .insert({
          user_id: user.id,
          lesson_id: input.lesson_id,
          title: input.title,
          content: input.content,
          tags: input.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    } catch (error) {
      throw new Error(
        `Failed to create note: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get all notes for a user
  async getUserNotes(): Promise<Note[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    } catch (error) {
      throw new Error(
        `Failed to fetch notes: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get notes for a specific lesson
  async getLessonNotes(lessonId: string): Promise<Note[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    } catch (error) {
      throw new Error(
        `Failed to fetch lesson notes: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Get single note
  async getNote(noteId: string): Promise<Note> {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) throw error;
      return data as Note;
    } catch (error) {
      throw new Error(
        `Failed to fetch note: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Update note
  async updateNote(noteId: string, input: NoteUpdateInput): Promise<Note> {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteId)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    } catch (error) {
      throw new Error(
        `Failed to update note: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Delete note
  async deleteNote(noteId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    } catch (error) {
      throw new Error(
        `Failed to delete note: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Pin/unpin note
  async pinNote(noteId: string, isPinned: boolean): Promise<Note> {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .update({ is_pinned: isPinned })
        .eq("id", noteId)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    } catch (error) {
      throw new Error(
        `Failed to pin note: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Search notes by tag
  async getNotesbyTag(tag: string): Promise<Note[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", user.id)
        .contains("tags", [tag]);

      if (error) throw error;
      return data as Note[];
    } catch (error) {
      throw new Error(
        `Failed to search notes: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // AI Analysis (mock implementation - to be replaced with actual API call)
  async analyzeNote(content: string): Promise<AIAnalysisResult> {
    try {
      // Call Edge Function for AI analysis
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze note");
      }

      const data = await response.json();
      return data as AIAnalysisResult;
    } catch (error) {
      throw new Error(
        `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  // Batch save notes (auto-save functionality)
  async batchUpdateNotes(notes: Note[]): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_notes")
        .upsert(notes.map((note) => ({ ...note, updated_at: new Date().toISOString() })));

      if (error) throw error;
    } catch (error) {
      throw new Error(
        `Failed to batch save notes: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
