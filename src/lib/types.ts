export type EventType =
  | "TOURNAMENT"
  | "LEAGUE"
  | "TRADE_NIGHT"
  | "CARD_SHOW"
  | "MEETUP";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ARCHIVED";

export type Organizer = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  start_at: string;
  end_at: string | null;
  venue_address: string;
  organizer_id: string | null;
  organizer?: Organizer | null;
  event_type: EventType;
  status: EventStatus;
  telegram_link: string | null;
  registration_link: string | null;
  admission_time_start: string;
  admission_time_end: string;
  admission_fee: string;
  interested_count?: number;
  created_at: string;
  updated_at: string;
};

export type EventInterest = {
  id: string;
  event_id: string;
  telegram_user_id: string;
  created_at: string;
};

export type EventFeedFilter = {
  search?: string;
  timeframe?: "weekend" | "week" | "next30";
};
