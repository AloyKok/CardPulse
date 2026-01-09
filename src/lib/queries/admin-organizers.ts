import { getSupabaseAdminClient } from "../supabase/admin";
import type { Organizer } from "../types";

export const listAdminOrganizers = async (): Promise<Organizer[]> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("organizers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getAdminOrganizerById = async (
  organizerId: string
): Promise<Organizer | null> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("organizers")
    .select("*")
    .eq("id", organizerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
};
