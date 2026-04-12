-- Add AI tables for chat_history and projects
-- profiles likely already exists as user_profiles

-- Enable RLS
alter publication supabase_realtime add table chat_history, projects;

-- Chat History table
create table if not exists chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Projects table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  code text not null,
  language text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table chat_history enable row level security;
alter table projects enable row level security;

create policy user_chat_history on chat_history 
  for all using (auth.uid() = user_id);

create policy user_projects on projects 
  for all using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_chat_history_user on chat_history(user_id);
create index if not exists idx_projects_user on projects(user_id);

-- Profiles table (if not exists, add basic)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy user_profile on profiles 
  for all using (auth.uid() = id);
