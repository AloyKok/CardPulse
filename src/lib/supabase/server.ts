import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "../env";

export const getSupabaseServerClient = () => {
  const config = getSupabaseConfig();

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
};
