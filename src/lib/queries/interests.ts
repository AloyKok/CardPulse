import { getSupabaseServerClient } from "../supabase/server";

export const getInterestCountForEvent = async (
  eventId: string
): Promise<number> => {
  const supabase = getSupabaseServerClient();
  const { count, error } = await supabase
    .from("event_interests")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const setEventInterest = async (
  eventId: string,
  telegramUserId: string,
  interested: boolean
) => {
  const supabase = getSupabaseServerClient();

  if (interested) {
    const { error } = await supabase
      .from("event_interests")
      .insert({ event_id: eventId, telegram_user_id: telegramUserId });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const { error } = await supabase
    .from("event_interests")
    .delete()
    .eq("event_id", eventId)
    .eq("telegram_user_id", telegramUserId);

  if (error) {
    throw new Error(error.message);
  }
};
