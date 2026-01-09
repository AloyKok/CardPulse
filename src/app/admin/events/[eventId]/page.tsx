import Link from "next/link";
import { notFound } from "next/navigation";

import { SelectField } from "@/components/SelectField";
import { duplicateEvent, setEventStatus, updateEvent } from "@/lib/admin/actions";
import { formatSgDate, formatSgTimeValue } from "@/lib/admin/datetime";
import { requireAdminSession } from "@/lib/admin/require-session";
import { formatEventStatus } from "@/lib/events";
import { listAdminOrganizers } from "@/lib/queries/admin-organizers";
import { getAdminEventById } from "@/lib/queries/admin-events";

const eventTypeOptions = [
  { label: "Tournament", value: "TOURNAMENT" },
  { label: "League", value: "LEAGUE" },
  { label: "Trade Night", value: "TRADE_NIGHT" },
  { label: "Card Show", value: "CARD_SHOW" },
  { label: "Meetup", value: "MEETUP" }
];

const admissionFeeOptions = [
  { label: "Free", value: "Free" },
  { label: "$5", value: "$5" },
  { label: "$10", value: "$10" },
  { label: "$15", value: "$15" },
  { label: "$20", value: "$20" },
  { label: "$25", value: "$25" },
  { label: "$30", value: "$30" }
];

export default async function EditEventPage({
  params,
  searchParams
}: {
  params: { eventId: string };
  searchParams?: { error?: string; success?: string };
}) {
  requireAdminSession();
  const [event, organizers] = await Promise.all([
    getAdminEventById(params.eventId),
    listAdminOrganizers()
  ]);
  const organizerOptions = [
    { label: "Unassigned", value: "" },
    ...organizers.map((organizer) => ({
      label: organizer.name,
      value: organizer.id
    }))
  ];

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <Link
          className="text-sm text-slate-500 hover:text-slate-700"
          href="/admin/events"
        >
          ← Back to events
        </Link>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Edit event
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Status: {formatEventStatus(event.status)} · Times shown in SGT
              </p>
            </div>
            <form action={duplicateEvent}>
              <input name="event_id" type="hidden" value={event.id} />
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                type="submit"
              >
                Duplicate
              </button>
            </form>
          </div>
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
          <form action={updateEvent} className="mt-6 grid gap-4">
            <input name="event_id" type="hidden" value={event.id} />
            <label className="text-sm font-semibold text-slate-700">
              Event name
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                defaultValue={event.title}
                name="title"
                required
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Event type
              <SelectField
                defaultValue={event.event_type}
                name="event_type"
                options={eventTypeOptions}
                placeholder="Select event type"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Organiser (optional)
              <SelectField
                defaultValue={event.organizer_id ?? ""}
                name="organizer_id"
                options={organizerOptions}
                placeholder="Unassigned"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Event start date
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  defaultValue={formatSgDate(event.start_at)}
                  name="start_date"
                  required
                  type="date"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Event end date (optional)
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  defaultValue={formatSgDate(event.end_at)}
                  name="end_date"
                  type="date"
                />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">
              Event address
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                defaultValue={event.venue_address}
                name="venue_address"
                required
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Admission start time
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  defaultValue={formatSgTimeValue(event.admission_time_start)}
                  name="admission_time_start"
                  required
                  type="time"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Admission end time
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  defaultValue={formatSgTimeValue(event.admission_time_end)}
                  name="admission_time_end"
                  required
                  type="time"
                />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">
              Admission fee
              <SelectField
                defaultValue={event.admission_fee}
                name="admission_fee"
                options={admissionFeeOptions}
                placeholder="Select fee"
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {event.status === "PUBLISHED" ? (
              <form action={setEventStatus}>
                <input name="event_id" type="hidden" value={event.id} />
                <input name="status" type="hidden" value="DRAFT" />
                <button
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
                  type="submit"
                >
                  Unpublish
                </button>
              </form>
            ) : (
              <form action={setEventStatus}>
                <input name="event_id" type="hidden" value={event.id} />
                <input name="status" type="hidden" value="PUBLISHED" />
                <button
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
                  type="submit"
                >
                  Publish
                </button>
              </form>
            )}
            {event.status !== "CANCELLED" && event.status !== "ARCHIVED" ? (
              <form action={setEventStatus}>
                <input name="event_id" type="hidden" value={event.id} />
                <input name="status" type="hidden" value="CANCELLED" />
                <button
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
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
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
                  type="submit"
                >
                  Archive
                </button>
              </form>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
