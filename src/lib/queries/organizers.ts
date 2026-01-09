import { getSupabaseServerClient } from "../supabase/server";
import type { Organizer } from "../types";

export const listOrganizers = async (): Promise<Organizer[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("organizers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getOrganizerById = async (
  organizerId: string
): Promise<Organizer | null> => {
  const supabase = getSupabaseServerClient();
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
