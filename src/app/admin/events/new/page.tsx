import Link from "next/link";

import { SelectField } from "@/components/SelectField";
import { createEvent } from "@/lib/admin/actions";
import { requireAdminSession } from "@/lib/admin/require-session";
import { listAdminOrganizers } from "@/lib/queries/admin-organizers";

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

export default async function NewEventPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  requireAdminSession();
  const organizers = await listAdminOrganizers();
  const organizerOptions = [
    { label: "Unassigned", value: "" },
    ...organizers.map((organizer) => ({
      label: organizer.name,
      value: organizer.id
    }))
  ];

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
          <h1 className="text-2xl font-semibold text-slate-900">
            Create event
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            All times are in Asia/Singapore.
          </p>
          {searchParams?.error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Missing or invalid fields. Please check and try again.
            </p>
          ) : null}
          <form action={createEvent} className="mt-6 grid gap-4">
            <label className="text-sm font-semibold text-slate-700">
              Event name
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                name="title"
                placeholder="Event name"
                required
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Event type
              <SelectField
                defaultValue="TOURNAMENT"
                name="event_type"
                options={eventTypeOptions}
                placeholder="Select event type"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Organiser (optional)
              <SelectField
                defaultValue=""
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
                  name="start_date"
                  required
                  type="date"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Event end date (optional)
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  name="end_date"
                  type="date"
                />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">
              Event address
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                name="venue_address"
                placeholder="Full address"
                required
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Admission start time
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  name="admission_time_start"
                  required
                  type="time"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Admission end time
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                  name="admission_time_end"
                  required
                  type="time"
                />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">
              Admission fee
              <SelectField
                defaultValue="Free"
                name="admission_fee"
                options={admissionFeeOptions}
                placeholder="Select fee"
              />
            </label>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
              <button
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
                name="intent"
                type="submit"
                value="draft"
              >
                Save draft
              </button>
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                name="intent"
                type="submit"
                value="publish"
              >
                Publish
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
