import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/require-session";
import { listAdminOrganizers } from "@/lib/queries/admin-organizers";

export default async function AdminOrganizersPage({
  searchParams
}: {
  searchParams?: { error?: string; success?: string };
}) {
  requireAdminSession();
  const organizers = await listAdminOrganizers();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Organizers</h1>
            <p className="text-sm text-slate-500">
              Manage organizer profiles and attach them to events.
            </p>
          </div>
          <Link
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            href="/admin/organizers/new"
          >
            New organizer
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
          {organizers.length === 0 ? (
            <p className="text-sm text-slate-500">
              No organizers yet. Create one to start attaching events.
            </p>
          ) : (
            <div className="grid gap-4">
              {organizers.map((organizer) => (
                <article
                  key={organizer.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {organizer.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Organizer profile
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link
                      className="rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700"
                      href={`/admin/organizers/${organizer.id}`}
                    >
                      Edit
                    </Link>
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
