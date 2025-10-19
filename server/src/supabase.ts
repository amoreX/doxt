import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

// Create a dummy Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Example: You can add type definitions for your database tables here
// export type Database = {
//   public: {
//     Tables: {
//       users: {
//         Row: {
//           id: string;
//           email: string;
//           created_at: string;
//         };
//       };
//     };
//   };
// };
