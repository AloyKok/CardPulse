import Link from "next/link";
import { notFound } from "next/navigation";

import { updateOrganizer } from "@/lib/admin/actions";
import { requireAdminSession } from "@/lib/admin/require-session";
import { listAdminEventsByOrganizer } from "@/lib/queries/admin-events";
import { getAdminOrganizerById } from "@/lib/queries/admin-organizers";
import { formatEventDate } from "@/lib/format";
import { formatEventType } from "@/lib/events";

export default async function EditOrganizerPage({
  params,
  searchParams
}: {
  params: { organizerId: string };
  searchParams?: { error?: string; success?: string };
}) {
  requireAdminSession();
  const [organizer, events] = await Promise.all([
    getAdminOrganizerById(params.organizerId),
    listAdminEventsByOrganizer(params.organizerId)
  ]);

  if (!organizer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <Link
          className="text-sm text-slate-500 hover:text-slate-700"
          href="/admin/organizers"
        >
          ← Back to organizers
        </Link>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit organizer
          </h1>
          {searchParams?.error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Missing or invalid fields. Please check and try again.
            </p>
          ) : null}
          {searchParams?.success ? (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              Changes saved.
            </p>
          ) : null}
          <form action={updateOrganizer} className="mt-6 grid gap-4">
            <input name="organizer_id" type="hidden" value={organizer.id} />
            <label className="text-sm font-semibold text-slate-700">
              Organizer name
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                defaultValue={organizer.name}
                name="name"
                required
              />
            </label>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                type="submit"
              >
                Save changes
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Organizer events
            </h2>
            <Link
              className="text-sm text-slate-500 hover:text-slate-700"
              href="/admin/events/new"
            >
              Add event
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No events linked to this organizer yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  className="rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200"
                  href={`/admin/events/${event.id}`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-500">
                      {formatEventDate(event.start_at)} · {event.venue_address}
                    </span>
                    <span className="text-base font-semibold text-slate-900">
                      {event.title}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {formatEventType(event.event_type)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
