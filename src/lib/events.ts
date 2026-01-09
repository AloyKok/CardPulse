import type { EventStatus, EventType } from "./types";

export const formatEventType = (type: EventType) => {
  switch (type) {
    case "TOURNAMENT":
      return "Tournament";
    case "LEAGUE":
      return "League";
    case "TRADE_NIGHT":
      return "Trade Night";
    case "CARD_SHOW":
      return "Card Show";
    case "MEETUP":
      return "Meetup";
    default:
      return type;
  }
};

export const formatEventStatus = (status: EventStatus) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PUBLISHED":
      return "Scheduled";
    case "CANCELLED":
      return "Cancelled";
    case "ARCHIVED":
      return "Archived";
    default:
      return status;
  }
};
