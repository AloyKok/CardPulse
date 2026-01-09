"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseSgDateTime } from "./datetime";
import { getSupabaseAdminClient } from "../supabase/admin";
import type { EventStatus, EventType } from "../types";

const eventTypes: EventType[] = [
  "TOURNAMENT",
  "LEAGUE",
  "TRADE_NIGHT",
  "CARD_SHOW",
  "MEETUP"
];

const eventStatuses: EventStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "CANCELLED",
  "ARCHIVED"
];

const requireString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value !== "string") {
    throw new Error(`Missing ${key}`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Missing ${key}`);
  }
  return trimmed;
};

const optionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizeTime = (value: string) =>
  /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;

const requireEnum = <T extends string>(
  value: string,
  allowed: readonly T[],
  field: string
): T => {
  if (allowed.includes(value as T)) {
    return value as T;
  }
  throw new Error(`Invalid ${field}`);
};

const parseEventPayload = (formData: FormData) => {
  const title = requireString(formData, "title");
  const eventType = requireEnum(
    requireString(formData, "event_type"),
    eventTypes,
    "event type"
  );
  const organizerId = optionalString(formData, "organizer_id");
  const venueAddress = requireString(formData, "venue_address");
  const startDate = requireString(formData, "start_date");
  const endDate = optionalString(formData, "end_date");
  const admissionTimeStart = normalizeTime(
    requireString(formData, "admission_time_start")
  );
  const admissionTimeEnd = normalizeTime(
    requireString(formData, "admission_time_end")
  );
  const startAt = parseSgDateTime(`${startDate}T${admissionTimeStart}`);

  if (!startAt) {
    throw new Error("Invalid start date");
  }

  const endAt = endDate
    ? parseSgDateTime(`${endDate}T${admissionTimeEnd}`)
    : null;

  if (endDate && !endAt) {
    throw new Error("Invalid end date");
  }

  return {
    title,
    start_at: startAt,
    end_at: endAt,
    venue_address: venueAddress,
    organizer_id: organizerId,
    event_type: eventType,
    telegram_link: optionalString(formData, "telegram_link"),
    registration_link: optionalString(formData, "registration_link"),
    admission_time_start: admissionTimeStart,
    admission_time_end: admissionTimeEnd,
    admission_fee: requireString(formData, "admission_fee")
  };
};

export const createEvent = async (formData: FormData) => {
  let eventId = "";

  try {
    const supabase = getSupabaseAdminClient();
    const payload = parseEventPayload(formData);
    const intent = optionalString(formData, "intent");
    const status: EventStatus =
      intent === "publish" ? "PUBLISHED" : "DRAFT";

    const { data, error } = await supabase
      .from("events")
      .insert({ ...payload, status })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    eventId = data.id;
  } catch (error) {
    console.error("createEvent error", error);
    redirect("/admin/events/new?error=1");
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect(`/admin/events/${eventId}?success=1`);
};

export const updateEvent = async (formData: FormData) => {
  let eventId = "";

  try {
    eventId = requireString(formData, "event_id");
    const supabase = getSupabaseAdminClient();
    const payload = parseEventPayload(formData);
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", eventId);

    if (error) {
      throw new Error(error.message);
    }

  } catch (error) {
    console.error("updateEvent error", error);
    redirect(
      eventId ? `/admin/events/${eventId}?error=1` : "/admin/events?error=1"
    );
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  redirect(`/admin/events/${eventId}?success=1`);
};

export const setEventStatus = async (formData: FormData) => {
  let eventId = "";

  try {
    eventId = requireString(formData, "event_id");
    const statusValue = requireString(formData, "status");
    const supabase = getSupabaseAdminClient();
    const status = requireEnum(statusValue, eventStatuses, "status");
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", eventId);

    if (error) {
      throw new Error(error.message);
    }

  } catch (error) {
    console.error("setEventStatus error", error);
    redirect("/admin/events?error=1");
  }

  revalidatePath("/admin/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  redirect("/admin/events?success=1");
};

export const duplicateEvent = async (formData: FormData) => {
  let eventId = "";
  let newEventId = "";

  try {
    eventId = requireString(formData, "event_id");
    const supabase = getSupabaseAdminClient();
    const { data: source, error } = await supabase
      .from("events")
      .select(
        "title, start_at, end_at, venue_address, organizer_id, event_type, telegram_link, registration_link, admission_time_start, admission_time_end, admission_fee"
      )
      .eq("id", eventId)
      .maybeSingle();

    if (error || !source) {
      throw new Error(error?.message ?? "Event not found");
    }

    const { data, error: insertError } = await supabase
      .from("events")
      .insert({
        ...source,
        title: `${source.title} (Copy)`,
        status: "DRAFT"
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    newEventId = data.id;
  } catch (error) {
    console.error("duplicateEvent error", error);
    redirect("/admin/events?error=1");
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect(`/admin/events/${newEventId}?success=1`);
};

export const createOrganizer = async (formData: FormData) => {
  let organizerId = "";

  try {
    const supabase = getSupabaseAdminClient();
    const name = requireString(formData, "name");
    const { data, error } = await supabase
      .from("organizers")
      .insert({
        name
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    organizerId = data.id;
  } catch (error) {
    console.error("createOrganizer error", error);
    redirect("/admin/organizers/new?error=1");
  }

  revalidatePath("/admin/organizers");
  revalidatePath(`/admin/organizers/${organizerId}`);
  redirect(`/admin/organizers/${organizerId}?success=1`);
};

export const updateOrganizer = async (formData: FormData) => {
  let organizerId = "";

  try {
    console.log(
      "updateOrganizer formData",
      Object.fromEntries(formData.entries())
    );
    organizerId = requireString(formData, "organizer_id");
    const supabase = getSupabaseAdminClient();
    const name = requireString(formData, "name");
    const { error } = await supabase
      .from("organizers")
      .update({
        name
      })
      .eq("id", organizerId);

    if (error) {
      throw new Error(error.message);
    }

  } catch (error) {
    console.error("updateOrganizer error", error);
    redirect(
      organizerId
        ? `/admin/organizers/${organizerId}?error=1`
        : "/admin/organizers?error=1"
    );
  }

  revalidatePath("/admin/organizers");
  revalidatePath(`/admin/organizers/${organizerId}`);
  redirect(`/admin/organizers/${organizerId}?success=1`);
};
