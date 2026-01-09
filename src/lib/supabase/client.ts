import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "../env";

let browserClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    const config = getSupabaseConfig();
    browserClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  return browserClient;
};
