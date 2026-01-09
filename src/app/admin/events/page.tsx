import Link from "next/link";

import { duplicateEvent, setEventStatus } from "@/lib/admin/actions";
import { requireAdminSession } from "@/lib/admin/require-session";
import { formatEventStatus, formatEventType } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { listAdminEvents } from "@/lib/queries/admin-events";

export default async function AdminEventsPage({
  searchParams
}: {
  searchParams?: { error?: string; success?: string };
}) {
  requireAdminSession();
  const events = await listAdminEvents();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Events</h1>
            <p className="text-sm text-slate-500">
              Create, duplicate, publish, cancel, or archive events.
            </p>
          </div>
          <Link
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            href="/admin/events/new"
          >
            New event
          </Link>
        </div>

        {searchParams?.error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
            Something went wrong. Try again.
          </p>
        ) : null}
        {searchParams?.success ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Saved successfully.
          </p>
        ) : null}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {events.length === 0 ? (
            <p className="text-sm text-slate-500">
              No events yet. Create your first event to get started.
            </p>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {event.title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {formatEventDate(event.start_at)} · {event.venue_address}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                        {formatEventType(event.event_type)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                        {formatEventStatus(event.status)}
                      </span>
                      <span>Organizer: {event.organizer?.name ?? "TBA"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <form action={duplicateEvent}>
                      <input name="event_id" type="hidden" value={event.id} />
                      <button
                        className="rounded-full bg-slate-900 px-3 py-2 font-semibold text-white"
                        type="submit"
                      >
                        Duplicate
                      </button>
                    </form>
                    <Link
                      className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                      href={`/admin/events/${event.id}`}
                    >
                      Edit
                    </Link>
                    {event.status === "PUBLISHED" ? (
                      <form action={setEventStatus}>
                        <input name="event_id" type="hidden" value={event.id} />
                        <input name="status" type="hidden" value="DRAFT" />
                        <button
                          className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                          type="submit"
                        >
                          Unpublish
                        </button>
                      </form>
                    ) : (
                      <form action={setEventStatus}>
                        <input name="event_id" type="hidden" value={event.id} />
                        <input
                          name="status"
                          type="hidden"
                          value="PUBLISHED"
                        />
                        <button
                          className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                          type="submit"
                        >
                          Publish
                        </button>
                      </form>
                    )}
                    {event.status !== "CANCELLED" &&
                    event.status !== "ARCHIVED" ? (
                      <form action={setEventStatus}>
                        <input name="event_id" type="hidden" value={event.id} />
                        <input name="status" type="hidden" value="CANCELLED" />
                        <button
                          className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                          type="submit"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : null}
                    {event.status !== "ARCHIVED" ? (
                      <form action={setEventStatus}>
                        <input name="event_id" type="hidden" value={event.id} />
                        <input name="status" type="hidden" value="ARCHIVED" />
                        <button
                          className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                          type="submit"
                        >
                          Archive
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
