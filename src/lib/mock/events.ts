import type { Event, Organizer } from "../types";

export const sampleOrganizers: Organizer[] = [
  {
    id: "org-cardboard",
    name: "Cardboard Chasers",
    created_at: "2024-01-05T00:00:00.000Z",
    updated_at: "2024-01-05T00:00:00.000Z"
  },
  {
    id: "org-hobbypoint",
    name: "Hobby Point SG",
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-10T00:00:00.000Z"
  },
  {
    id: "org-sgtradehub",
    name: "SG Trade Hub",
    created_at: "2024-02-01T00:00:00.000Z",
    updated_at: "2024-02-01T00:00:00.000Z"
  }
];

export const sampleEvents: Event[] = [
  {
    id: "event-1",
    title: "Saturday League Challenge",
    start_at: "2024-08-10T02:00:00.000Z",
    end_at: "2024-08-10T07:00:00.000Z",
    venue_address: "277 Orchard Rd, #03-09, Singapore",
    organizer_id: sampleOrganizers[0].id,
    organizer: sampleOrganizers[0],
    event_type: "TOURNAMENT",
    status: "PUBLISHED",
    telegram_link: "https://t.me/cardboardchasers",
    registration_link: "https://t.me/cardboardchasers/123",
    admission_time_start: "09:00:00",
    admission_time_end: "10:30:00",
    admission_fee: "Free",
    interested_count: 18,
    created_at: "2024-07-25T00:00:00.000Z",
    updated_at: "2024-08-08T02:00:00.000Z"
  },
  {
    id: "event-2",
    title: "Wednesday League Night",
    start_at: "2024-08-14T11:00:00.000Z",
    end_at: "2024-08-14T14:00:00.000Z",
    venue_address: "6 Raffles Blvd, #02-135, Singapore",
    organizer_id: sampleOrganizers[1].id,
    organizer: sampleOrganizers[1],
    event_type: "LEAGUE",
    status: "PUBLISHED",
    telegram_link: "https://t.me/hobbypointsg",
    registration_link: null,
    admission_time_start: "19:30:00",
    admission_time_end: "20:00:00",
    admission_fee: "$5",
    interested_count: 9,
    created_at: "2024-07-20T00:00:00.000Z",
    updated_at: "2024-08-07T05:00:00.000Z"
  },
  {
    id: "event-3",
    title: "Trade & Chill Meetup",
    start_at: "2024-08-18T06:00:00.000Z",
    end_at: "2024-08-18T10:00:00.000Z",
    venue_address: "51 Somerset Rd, Singapore",
    organizer_id: sampleOrganizers[2].id,
    organizer: sampleOrganizers[2],
    event_type: "TRADE_NIGHT",
    status: "PUBLISHED",
    telegram_link: "https://t.me/sgtradehub",
    registration_link: null,
    admission_time_start: "13:00:00",
    admission_time_end: "14:00:00",
    admission_fee: "Free",
    interested_count: 27,
    created_at: "2024-07-15T00:00:00.000Z",
    updated_at: "2024-08-05T00:00:00.000Z"
  }
];

export const getSampleEvent = (eventId: string) =>
  sampleEvents.find((event) => event.id === eventId) ?? null;

export const getSampleOrganizer = (organizerId: string) =>
  sampleOrganizers.find((organizer) => organizer.id === organizerId) ?? null;

export const getSampleEventsByOrganizer = (organizerId: string) =>
  sampleEvents.filter((event) => event.organizer_id === organizerId);
