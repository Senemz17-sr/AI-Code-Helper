# Phase 2 Implementation Guide: Using New Features

## Quick Start - Authentication

### Protect a Component
```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

### Use Auth in Components
```tsx
import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, logout, login } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <p>Level: {user?.level}</p>
      <p>XP: {user?.xp}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Gamification Integration

### Award XP to User
```tsx
import { useGamification } from "@/hooks/useGamification";

export function LessonPage() {
  const { addXP, recordLessonCompletion } = useGamification(userId);
  
  const handleLessonComplete = async () => {
    await recordLessonCompletion(lessonId);
    // +100 XP automatically
  };
}
```

### Display User Stats
```tsx
import { useGamification } from "@/hooks/useGamification";

export function UserStats() {
  const { xp, level, achievements } = useGamification(userId);
  
  return (
    <div>
      <p>Level: {level}</p>
      <p>XP: {xp}</p>
      <p>Achievements: {achievements.length}</p>
    </div>
  );
}
```

### Add Badge to User
```tsx
const { awardBadge } = useGamification(userId);

// After some achievement
await awardBadge(
  "perfect_quiz",
  "Score 100% on a quiz",
  "🎓"
);
```

### Get Leaderboard Data
```tsx
import { useLeaderboard } from "@/hooks/useGamification";

export function Leaderboard() {
  const { leaderboard, isLoading } = useLeaderboard();
  
  return leaderboard.map((entry) => (
    <div key={entry.user_id}>
      <p>{entry.rank}. {entry.username}</p>
      <p>Level {entry.level}</p>
      <p>{entry.xp} XP</p>
    </div>
  ));
}
```

## Note-Taking Integration

### Create a Note
```tsx
import { useNotes } from "@/hooks/useNotes";

export function LessonNotes({ lessonId }) {
  const { notes, createNote } = useNotes(lessonId);
  
  const handleCreateNote = async () => {
    await createNote({
      lesson_id: lessonId,
      title: "My Note",
      content: "Note content here",
      tags: ["important", "concept"]
    });
  };
}
```

### Display and Edit Notes
```tsx
export function NoteEditor({ lessonId }) {
  const { notes, updateNote, deleteNote, pinNote } = useNotes(lessonId);
  
  return notes.map((note) => (
    <div key={note.id}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => updateNote(note.id, { title: "New Title" })}>
        Edit
      </button>
      <button onClick={() => deleteNote(note.id)}>Delete</button>
      <button onClick={() => pinNote(note.id, !note.is_pinned)}>
        {note.is_pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  ));
}
```

### Auto-Save Notes
Notes automatically save every 30 seconds. No manual save needed!

## User Profile Integration

### Display in Navbar
Already implemented! User profile dropdown shows in navbar when authenticated.

### Link to Profile
```tsx
<Link to="/profile">View Profile</Link>
```

### Get User Data
```tsx
const { user } = useAuth();

// User has:
// - username, email, avatar
// - xp, level, streak_days
// - badges, certificates
// - courses_completed, lessons_completed
// - quiz_average
// - bio, location
```

## Leaderboard Display

### Visit Leaderboard
```
/leaderboard
```

Features:
- Top 3 podium display
- Filter by XP, Level, or Badges
- Real-time rank updates
- Beautiful UI with animations

## API Endpoints Ready (To Implement)

All services use Supabase. No API endpoints needed - use service layer directly:

### Auth Service
```tsx
import { authService } from "@/lib/api/auth";

await authService.signup(email, username, password);
await authService.login(email, password);
await authService.getCurrentUser();
await authService.updateUserProfile({ username, bio });
```

### Gamification Service
```tsx
import { gamificationService } from "@/lib/api/gamification";

await gamificationService.addXP(userId, 100);
await gamificationService.awardBadge(userId, "badge_name", "description", "icon");
await gamificationService.getLeaderboard(50);
await gamificationService.updateStreak(userId);
```

### Note Service
```tsx
import { noteService } from "@/lib/api/notes";

await noteService.createNote(input);
await noteService.getUserNotes();
await noteService.getLessonNotes(lessonId);
await noteService.updateNote(noteId, updates);
await noteService.analyzeNote(content); // AI analysis
```

## Database Setup Required

### Create Tables in Supabase

```sql
-- Users already handled by Supabase Auth

-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  courses_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  quiz_average FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  name TEXT,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- User Notes
CREATE TABLE user_notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  lesson_id TEXT,
  title TEXT,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lesson Completions
CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  lesson_id TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

## Environment Variables

Add to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Features

### Test Authentication
1. Go to `/auth`
2. Create new account with email/password
3. Check user profile at `/profile`
4. See user dropdown in navbar

### Test Gamification
1. Complete a lesson (records completion + 100 XP)
2. Check profile to see XP/Level updated
3. View `/leaderboard` to see ranking

### Test Notes
1. Go to lesson page (when implemented)
2. Create note (auto-saves)
3. Edit, pin, or delete notes

## Component Integration Points

### In LessonPage.tsx
```tsx
import { useGamification } from "@/hooks/useGamification";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";

export function LessonPage() {
  const { user } = useAuth();
  const { recordLessonCompletion } = useGamification(user?.id);
  const { notes, createNote } = useNotes(lessonId);
  
  // Use hooks here
}
```

### In QuizComponent.tsx
```tsx
const { addXP, awardBadge } = useGamification(userId);

const handleQuizComplete = async (score) => {
  await addXP(50); // Quiz completion XP
  if (score === 100) {
    await awardBadge(userId, "Quiz Master", "Score 100%", "🎓");
  }
};
```

## Error Handling

All services throw errors with user-friendly messages. Use try/catch:

```tsx
try {
  await gamificationService.addXP(userId, 100);
} catch (error) {
  console.error(error.message); // e.g., "Failed to add XP: User not found"
  toast.error(error.message);
}
```

## Performance Notes

- Notes auto-save every 30 seconds (not on every keystroke)
- Leaderboard refreshes every 30 seconds
- All data cached in component state
- useNotes provides optimistic updates

## Architecture

```
Component
  ↓ (uses hook)
Hook (useAuth, useGamification, useNotes)
  ↓ (calls service)
Service (authService, gamificationService, noteService)
  ↓ (executes)
Supabase (Database + Auth)
```

This architecture ensures:
- Separation of concerns
- Easy testing
- Reusable logic
- Type safety

---
**Be sure to:**
1. Setup Supabase tables from SQL above
2. Add environment variables
3. Import AuthProvider in App.tsx ✅ (already done)
4. Wrap protected pages with ProtectedRoute ✅ (already done)
5. Import and use hooks in components (do this in Phase 2b)

