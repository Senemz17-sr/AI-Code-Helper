import { createClient } from '@supabase/supabase-js'

// Temporary Database type - run `supabase gen types typescript --local > src/types/supabase.ts` to update
export type Database = any

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Usage:
// import { supabase } from '@/lib/supabase'
