import Link from "next/link";
import { notFound } from "next/navigation";

import { formatEventStatus, formatEventType } from "@/lib/events";
import { formatAdmissionTimeRange, formatEventDateRange } from "@/lib/format";
import { getSampleEvent } from "@/lib/mock/events";
import { getEventById } from "@/lib/queries/events";

const loadEvent = async (eventId: string) => {
  try {
    return await getEventById(eventId);
  } catch {
    return getSampleEvent(eventId);
  }
};

export default async function EventDetail({
  params
}: {
  params: { eventId: string };
}) {
  const event = await loadEvent(params.eventId);

  if (!event) {
    notFound();
  }

  const actionLinks = [
    {
      label: "Register",
      href: event.registration_link
    },
    {
      label: "Open Telegram",
      href: event.telegram_link
    }
  ].filter((action) => Boolean(action.href));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12">
        <Link className="text-sm text-slate-500 hover:text-slate-700" href="/">
          ← Back to events
        </Link>

        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {formatEventType(event.event_type)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                event.status === "CANCELLED"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {formatEventStatus(event.status)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {event.title}
            </h1>
            <p className="text-base text-slate-600">
              {formatEventDateRange(event.start_at, event.end_at)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Event address
              </p>
              <p className="text-sm text-slate-600">
                {event.venue_address}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Organizer
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {event.organizer?.name ?? "To be announced"}
              </p>
              {event.organizer ? (
                <Link
                  className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-800"
                  href={`/organizers/${event.organizer.id}`}
                >
                  View organizer profile
                </Link>
              ) : (
                <p className="text-sm text-slate-500">Profile pending</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Admission time
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatAdmissionTimeRange(
                  event.admission_time_start,
                  event.admission_time_end
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Admission fee
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {event.admission_fee}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              className="w-full rounded-full bg-slate-900 px-5 py-2 text-center text-sm font-semibold text-white sm:w-auto"
              type="button"
            >
              Interested
            </button>
            <button
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-center text-sm font-semibold text-slate-600 sm:w-auto"
              type="button"
            >
              Add to calendar
            </button>
            {actionLinks.map((action) => (
              <a
                key={action.label}
                className="w-full rounded-full border border-slate-200 px-5 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-300 sm:w-auto"
                href={action.href ?? "#"}
                rel="noreferrer"
                target="_blank"
              >
                {action.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
