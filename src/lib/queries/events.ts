import { getSupabaseServerClient } from "../supabase/server";
import type { Event, EventFeedFilter } from "../types";

const timeframeDays = {
  weekend: 3,
  week: 7,
  next30: 30
} as const;

export const listPublishedEvents = async (
  filter: EventFeedFilter = {}
): Promise<Event[]> => {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("events")
    .select("*, organizer:organizers(*)")
    .eq("status", "PUBLISHED")
    .order("start_at", { ascending: true });

  if (filter.search) {
    const term = filter.search.trim();
    if (term.length) {
      query = query.or(
        `title.ilike.%${term}%,venue_address.ilike.%${term}%`
      );
    }
  }

  if (filter.timeframe) {
    const days = timeframeDays[filter.timeframe];
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + days);

    query = query
      .gte("start_at", now.toISOString())
      .lte("start_at", end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getEventById = async (
  eventId: string
): Promise<Event | null> => {
  const supabase = getSupabaseServerClient();
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

export const listEventsByOrganizer = async (
  organizerId: string
): Promise<Event[]> => {
  const supabase = getSupabaseServerClient();
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
