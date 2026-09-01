import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
    const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables missing. Supabase integration disabled.');
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}
