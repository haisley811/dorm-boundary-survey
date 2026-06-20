import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type ResponseRow = {
  id?: string;
  created_at?: string;
  respondent_id: string | null;
  region: string | null;
  is_beijing_school: string | null;
  dorm_size: string | null;
  dorm_type: string | null;
  boundary_methods: string[] | null;
  main_boundary: string | null;
  boundary_metaphor_action: string | null;
  intrusion_types: string[] | null;
  worst_intrusion: string | null;
  failure_moment: string | null;
  response_behavior: string | null;
  psychological_effects: string[] | null;
  responsibility: string | null;
  boundary_metaphor_object: string | null;
  result_type: string | null;
  user_agent: string | null;
};

export const hasPublicSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export function createBrowserSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
