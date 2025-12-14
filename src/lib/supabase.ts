import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:8000';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Flag to check if we're in offline/demo mode
export const isOfflineMode = !import.meta.env.VITE_SUPABASE_URL || supabaseUrl === 'http://localhost:8000';

if (isOfflineMode) {
  console.info('Running in offline/demo mode - using mock data');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
