import Link from "next/link";

import { formatEventType } from "@/lib/events";
import { formatAdmissionTimeRange, formatEventDateRange } from "@/lib/format";
import { sampleEvents } from "@/lib/mock/events";
import { listPublishedEvents } from "@/lib/queries/events";
import type { Event } from "@/lib/types";

const loadEvents = async (): Promise<Event[]> => {
  try {
    return await listPublishedEvents();
  } catch {
    return sampleEvents;
  }
};

export default async function Home() {
  const events = await loadEvents();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            CardPulse
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Pokemon TCG events in Singapore, curated and accurate.
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
              This Week
            </span>
            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
              This Weekend
            </span>
            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Next 30 Days
            </span>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Upcoming events
            </h2>
            <span className="text-sm text-slate-500">Sorted by soonest</span>
          </div>

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
                      {formatEventDateRange(event.start_at, event.end_at)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {event.venue_address}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {formatEventType(event.event_type)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {event.admission_fee.toLowerCase() === "free"
                        ? "Free"
                        : "Paid"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatAdmissionTimeRange(
                        event.admission_time_start,
                        event.admission_time_end
                      )}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
