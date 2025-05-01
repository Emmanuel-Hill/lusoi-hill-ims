
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These are public keys, safe to be in the client-side code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key. Check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export typed helpers for improved type safety when using Supabase queries
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];
