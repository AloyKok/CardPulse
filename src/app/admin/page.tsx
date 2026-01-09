import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionCookie,
  getAdminPassword,
  getAdminSessionToken,
  isAdminSessionValid
} from "@/lib/admin/auth";

export default function AdminPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthed = isAdminSessionValid(token);

  const login = async (formData: FormData) => {
    "use server";
    const password = formData.get("password");
    if (typeof password !== "string") {
      redirect("/admin?error=1");
    }

    if (password !== getAdminPassword()) {
      redirect("/admin?error=1");
    }

    const cookie = buildAdminSessionCookie(getAdminSessionToken());
    cookies().set(cookie);
    redirect("/admin");
  };

  const logout = async () => {
    "use server";
    cookies().set({
      name: ADMIN_SESSION_COOKIE,
      value: "",
      maxAge: 0,
      path: "/"
    });
    redirect("/admin");
  };

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16">
          <Link className="text-sm text-slate-500 hover:text-slate-700" href="/">
            ← Back to events
          </Link>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin access
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the admin password to manage events and organizers.
            </p>
            {searchParams?.error ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
                Incorrect password. Try again.
              </p>
            ) : null}
            <form action={login} className="mt-6 flex flex-col gap-4">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
                name="password"
                placeholder="Admin password"
                type="password"
              />
              <button
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                type="submit"
              >
                Unlock admin
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Admin dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage events and organizers in under 30 minutes a week.
            </p>
          </div>
          <form action={logout}>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              type="submit"
            >
              Log out
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-6"
            href="/admin/events"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Event management
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create, duplicate, publish, cancel, and archive events.
            </p>
          </Link>
          <Link
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-6"
            href="/admin/organizers"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Organizer management
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Maintain organizer profiles and social links.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
