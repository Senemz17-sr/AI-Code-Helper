export interface Note {
  id: string;
  user_id: string;
  lesson_id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteCreateInput {
  lesson_id: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface NoteUpdateInput {
  title?: string;
  content?: string;
  tags?: string[];
  is_pinned?: boolean;
}

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  suggestedTags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedReadTime: number; // in minutes
}
