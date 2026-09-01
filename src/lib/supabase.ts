import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export function getSupabaseKeys() {
  const supabaseUrl = (import.meta.env as any)?.VITE_SUPABASE_URL || 'https://yqqtiovnkusoicgamuqd.supabase.co';
  const supabaseAnonKey = (import.meta.env as any)?.VITE_SUPABASE_ANON_KEY || '';
  return { supabaseUrl, supabaseAnonKey };
}

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();
  // Valid Supabase anon keys are JWTs starting with eyJ
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseAnonKey.startsWith('eyJ') &&
    supabaseAnonKey.split('.').length === 3
  );
}

export function getSupabase() {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    // If key is not a valid JWT, do not initialize to avoid 401 WebSocket error loops
    if (!isSupabaseConfigured() && !supabaseAnonKey.startsWith('eyJ')) {
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

