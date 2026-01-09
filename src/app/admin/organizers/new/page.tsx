import Link from "next/link";

import { createOrganizer } from "@/lib/admin/actions";
import { requireAdminSession } from "@/lib/admin/require-session";

export default function NewOrganizerPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  requireAdminSession();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <Link
          className="text-sm text-slate-500 hover:text-slate-700"
          href="/admin/organizers"
        >
          ← Back to organizers
        </Link>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create organizer
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add a profile to attach events quickly.
          </p>
          {searchParams?.error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Missing or invalid fields. Please check and try again.
            </p>
          ) : null}
          <form action={createOrganizer} className="mt-6 grid gap-4">
            <label className="text-sm font-semibold text-slate-700">
              Organizer name
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                name="name"
                placeholder="Organizer name"
                required
              />
            </label>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
              <button
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:w-auto"
                type="submit"
              >
                Save organizer
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
