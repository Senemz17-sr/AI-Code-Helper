# Supabase Backend Setup TODO

## Current Progress
- [x] Understand project structure and existing files
- [x] Create detailed implementation plan
- [x] **Step 1**: Create `src/lib/supabase.ts` - Supabase client with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

## Implementation Steps

### Phase 1: Core Files (New files only, no modifications)
1. [x] **Step 1**: Create `src/lib/supabase.ts` - Supabase client with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ✓ Fixed TS error
2. [x] **Step 2**: Create `.env.example` with all required env vars
3. [x] **Step 3**: Create `src/pages/SignIn.tsx` - Email/password form wired to AuthContext ✓ Sign In / Get Started buttons created

4. [x] **Step 4**: Create Supabase database schema SQL for profiles, chat_history, projects tables with RLS ✓ Ready for `supabase db push`

### Phase 2: Integration (Minimal edits)
 5. [x] **Step 5**: Update `src/App.tsx` to protect `/helper` route with ProtectedRoute (no allowGuest) and add /signin route ✓ Protected CodeHelper AI, /signin route added

**Next Action: Step 6 complete (Edge function created), run `supabase functions deploy ai-chat`**

 6. [x] **Step 6**: Create `supabase/functions/ai-chat/index.ts` - Edge function proxy for AI API ✓ Ready
7. [ ] **Step 7**: Update `src/pages/AIHelperPage.tsx` to use real AI calls via proxy and save to chat_history/projects
8. [ ] **Step 8**: Run `supabase db push`, `supabase functions deploy ai-chat`, test auth/protected routes

## Environment Setup Commands (Run after Step 2)
```
cp .env.example .env.local
supabase gen types typescript --local > src/types/supabase.ts
supabase start  # for local dev
```

## Testing Checklist
- [ ] Sign In/Sign Up buttons work (email/password)
- [ ] Protected AI page redirects unauth users to signin
- [ ] Chat history/projects save for logged-in users
- [ ] Edge function proxies AI requests (test with curl/postman)

**Next Action: Complete Step 1 (src/lib/supabase.ts)**
