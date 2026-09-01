import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export function getSupabaseKeys() {
  const supabaseUrl = (import.meta.env as any)?.VITE_SUPABASE_URL || 'https://yqqtiovnkusoicgamuqd.supabase.co';
  const supabaseAnonKey = (import.meta.env as any)?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_oqozEzhzYcQEsCi6T0I0qQ_0KirtKLo';
  return { supabaseUrl, supabaseAnonKey };
}

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();
  // Valid Supabase anon keys can be modern publishable keys (sb_publishable_...) or legacy JWTs (eyJ...)
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    (supabaseAnonKey.startsWith('sb_publishable_') || supabaseAnonKey.startsWith('eyJ'))
  );
}

export function getSupabase() {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Error initializing Supabase client:', e);
      return null;
    }
  }
  return supabaseClient;
}

