import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

console.log("Supabase URL:", supabaseUrl);
console.log(
  "Supabase Anon Key:",
  supabaseAnonKey ? "Exists (not showing for security)" : "Missing"
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Period = {
  id?: string;
  user_id: string;
  start_date: string; // ISO date string
  end_date?: string; // ISO date string (optional until period ends)
  flow: "light" | "medium" | "heavy"; // Flow at the start of period
  pain_level?: number; // 0-10 scale
  mood?: "happy" | "neutral" | "sad";
  symptoms?: string[]; // Array of symptom IDs
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type UserSettings = {
  id?: string;
  user_id: string;
  cycle_length: number; // Automatically calculated but can be overridden
  period_length: number; // Automatically calculated but can be overridden
  created_at?: string;
  updated_at?: string;
}; // Added missing semicolon here

export type DailyLog = {
  id?: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  flow: "none" | "light" | "medium" | "heavy" | null;
  mood?: "happy" | "neutral" | "sad" | null;
  pain_level?: number | null; // 0-10 scale
  symptoms?: string[] | null; // Array of symptom IDs
  notes?: string | null;
  created_at?: string;
};
