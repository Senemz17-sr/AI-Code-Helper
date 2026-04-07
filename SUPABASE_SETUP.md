# Supabase Database Setup Guide

## Prerequisites
- Supabase account created
- Project created in Supabase
- Access to SQL Editor

## Step 1: Enable Row Level Security (RLS)

Go to Supabase Dashboard → Authentication → Policies

Enable RLS for:
- auth.users (already enabled)

## Step 2: Create Database Tables

In Supabase Dashboard → SQL Editor, run these queries:

### 1. Create user_profiles Table

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  courses_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  quiz_average FLOAT DEFAULT 0,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX idx_user_profiles_level ON user_profiles(level DESC);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public can read profiles (for leaderboard)
CREATE POLICY "Profiles are readable"
  ON user_profiles FOR SELECT
  USING (true);
```

### 2. Create user_badges Table

```sql
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Badges are readable"
  ON user_badges FOR SELECT
  USING (true);
```

### 3. Create user_notes Table

```sql
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_user_notes_lesson ON user_notes(user_id, lesson_id);
CREATE INDEX idx_user_notes_pinned ON user_notes(user_id, is_pinned);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notes"
  ON user_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
  ON user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. Create lesson_completions Table

```sql
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_completions_user ON lesson_completions(user_id);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own completions"
  ON lesson_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record completions"
  ON lesson_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 5. Create Leaderboard View

```sql
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  id,
  username,
  avatar,
  xp,
  level,
  (SELECT COUNT(*) FROM user_badges WHERE user_id = user_profiles.id) as badge_count,
  ROW_NUMBER() OVER (ORDER BY xp DESC) as rank
FROM user_profiles
WHERE xp > 0
ORDER BY xp DESC;

-- Grant access to view
GRANT SELECT ON leaderboard TO authenticated, anon;
```

## Step 3: Set Up Authentication Triggers

### Trigger: Auto-create user_profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Generate username from email
  v_username := SPLIT_PART(new.email, '@', 1) || '_' || SUBSTR(gen_random_uuid()::TEXT, 1, 4);
  
  INSERT INTO public.user_profiles (id, email, username)
  VALUES (new.id, new.email, v_username)
  ON CONFLICT DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Trigger: Auto-update user_profiles updated_at

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_timestamp
  BEFORE UPDATE ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Verify Setup

Run these queries to verify everything is set up:

```sql
-- Check user_profiles exists
SELECT COUNT(*) as profile_count FROM user_profiles;

-- Check user_badges exists
SELECT COUNT(*) as badge_count FROM user_badges;

-- Check user_notes exists
SELECT COUNT(*) as notes_count FROM user_notes;

-- Check leaderboard view
SELECT * FROM leaderboard LIMIT 5;

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

## Step 5: Seed Test Data (Optional)

To test with real data:

```sql
-- Insert test users (manually for initial data)
-- Note: In production, this is handled by Sign Up flow

-- Create test badges for first user
INSERT INTO user_badges (user_id, name, description, icon, earned_at)
SELECT id, 'First Steps', 'Complete your first lesson', '🎯', NOW()
FROM user_profiles
LIMIT 1;

-- Grant XP to first user
UPDATE user_profiles
SET xp = 500, level = 1
WHERE id IN (SELECT id FROM user_profiles LIMIT 1);
```

## Step 6: Update Environment Variables

In your `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from Supabase Dashboard → Settings → API Keys

## Step 7: Test Authentication with Your App

1. Go to your app at `http://localhost:5173`
2. Click "Sign In" button
3. Go to `/auth`
4. Create new account (use real email)
5. Check Supabase → SQL Editor → `SELECT * FROM user_profiles;`
6. You should see your new user!

## Step 8: Grant User Permissions (Important!)

Run this query to ensure users can access their data:

```sql
-- Allow authenticated users to access their own data
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_badges TO authenticated;
GRANT ALL ON public.user_notes TO authenticated;
GRANT ALL ON public.lesson_completions TO authenticated;
GRANT SELECT ON public.leaderboard TO authenticated;

-- Allow anonymous users (logged out) to view leaderboard
GRANT SELECT ON public.leaderboard TO anon;
```

## Troubleshooting

### "Row level security violation"
- Make sure RLS policies are created correctly
- Check `auth.uid()` is not null: `SELECT auth.uid();`
- Verify user is logged in

### "Table permissions denied"
- Run the GRANT statements from Step 8
- Restart your app after updating permissions

### "Username already exists"
- The auto-generated username is unique
- If manually creating users, ensure unique usernames

### "Trigger not firing"
- Check trigger exists: `SELECT * FROM information_schema.triggers;`
- Manually run trigger function if needed

### "Leaderboard view not working"
- Run: `SELECT * FROM leaderboard;` directly in SQL Editor
- If error, check all tables exist first
- Verify user_profiles has data

## Backup & Recovery

### Backup your database

Supabase automatically backs up, but you can also export:

1. Go to Supabase Dashboard → Backups
2. Create manual backup
3. Download if needed

### Export data

```sql
-- Export user data
SELECT * FROM user_profiles;

-- Export badges
SELECT * FROM user_badges;

-- Export notes
SELECT * FROM user_notes;
```

## Next Steps

1. ✅ Run all SQL queries above
2. ✅ Grant user permissions
3. ✅ Test signup flow
4. ✅ Check user_profiles created
5. ✅ Test creating notes
6. ✅ Test recording lesson completions
7. ✅ Check leaderboard view
8. Ready for production!

---

## Quick Reference: SQL Recap

```bash
# Run all at once (copy to SQL Editor):

-- Tables
CREATE TABLE user_profiles (...);
CREATE TABLE user_badges (...);
CREATE TABLE user_notes (...);
CREATE TABLE lesson_completions (...);

-- Triggers
CREATE TRIGGER on_auth_user_created ...;
CREATE TRIGGER update_user_profiles_timestamp ...;
CREATE TRIGGER update_user_notes_timestamp ...;

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.* TO authenticated;

-- Test
SELECT COUNT(*) FROM user_profiles;
```

**Status**: Ready to use! Follow steps 1-7 above.
