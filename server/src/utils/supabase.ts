import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

// Create a dummy Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
