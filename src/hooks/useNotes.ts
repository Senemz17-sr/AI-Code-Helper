import { useState, useCallback, useEffect } from "react";
import { noteService } from "@/lib/api/notes";
import { Note, NoteCreateInput, NoteUpdateInput } from "@/types/notes";

export function useNotes(lessonId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes or lesson notes
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      let data;
      if (lessonId) {
        data = await noteService.getLessonNotes(lessonId);
      } else {
        data = await noteService.getUserNotes();
      }
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  // Create note
  const createNote = useCallback(
    async (input: NoteCreateInput) => {
      setIsLoading(true);
      try {
        const newNote = await noteService.createNote(input);
        setNotes([newNote, ...notes]);
        setError(null);
        return newNote;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [notes]
  );

  // Update note
  const updateNote = useCallback(
    async (noteId: string, input: NoteUpdateInput) => {
      setIsLoading(true);
      try {
        const updated = await noteService.updateNote(noteId, input);
        setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
        setError(null);
        return updated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [notes]
  );

  // Delete note
  const deleteNote = useCallback(
    async (noteId: string) => {
      setIsLoading(true);
      try {
        await noteService.deleteNote(noteId);
        setNotes(notes.filter((n) => n.id !== noteId));
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [notes]
  );

  // Pin note
  const pinNote = useCallback(
    async (noteId: string, isPinned: boolean) => {
      setIsLoading(true);
      try {
        const updated = await noteService.pinNote(noteId, isPinned);
        setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [notes]
  );

  // Search by tag
  const searchByTag = useCallback(
    async (tag: string) => {
      setIsLoading(true);
      try {
        const data = await noteService.getNotesbyTag(tag);
        setNotes(data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Auto-save notes periodically
  useEffect(() => {
    if (notes.length === 0) return;

    const interval = setInterval(async () => {
      try {
        await noteService.batchUpdateNotes(notes);
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [notes]);

  // Initial fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    searchByTag,
  };
}

export function useNote(noteId: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const data = await noteService.getNote(noteId);
        setNote(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  return { note, isLoading, error };
}
