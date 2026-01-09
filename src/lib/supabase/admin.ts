import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig, getSupabaseServiceRoleKey } from "../env";

export const getSupabaseAdminClient = () => {
  const config = getSupabaseConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(config.supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
};
