import Link from "next/link";
import { notFound } from "next/navigation";

import { formatEventType } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import {
  getSampleEventsByOrganizer,
  getSampleOrganizer
} from "@/lib/mock/events";
import { listEventsByOrganizer } from "@/lib/queries/events";
import { getOrganizerById } from "@/lib/queries/organizers";
import type { Event, Organizer } from "@/lib/types";

const loadOrganizer = async (organizerId: string): Promise<Organizer | null> => {
  try {
    return await getOrganizerById(organizerId);
  } catch {
    return getSampleOrganizer(organizerId);
  }
};

const loadEvents = async (organizerId: string): Promise<Event[]> => {
  try {
    return await listEventsByOrganizer(organizerId);
  } catch {
    return getSampleEventsByOrganizer(organizerId);
  }
};

export default async function OrganizerProfile({
  params
}: {
  params: { organizerId: string };
}) {
  const [organizer, events] = await Promise.all([
    loadOrganizer(params.organizerId),
    loadEvents(params.organizerId)
  ]);

  if (!organizer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12">
        <Link className="text-sm text-slate-500 hover:text-slate-700" href="/">
          ← Back to events
        </Link>

        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {organizer.name}
            </h1>
            <p className="text-base text-slate-600">
              Organizer profile for Pokemon TCG events in Singapore.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Upcoming events
          </h2>
          {events.length === 0 ? (
            <p className="text-base text-slate-600">
              No upcoming events listed yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        <Link
                          className="transition hover:text-slate-700"
                          href={`/events/${event.id}`}
                        >
                          {event.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-slate-600">
                        {formatEventDate(event.start_at)} · {event.venue_address}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {formatEventType(event.event_type)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
