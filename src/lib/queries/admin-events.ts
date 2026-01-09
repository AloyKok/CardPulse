import { getSupabaseAdminClient } from "../supabase/admin";
import type { Event } from "../types";

export const listAdminEvents = async (): Promise<Event[]> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, organizer:organizers(*)")
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getAdminEventById = async (
  eventId: string
): Promise<Event | null> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, organizer:organizers(*)")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
};

export const listAdminEventsByOrganizer = async (
  organizerId: string
): Promise<Event[]> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, organizer:organizers(*)")
    .eq("organizer_id", organizerId)
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};
