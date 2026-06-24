import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.14),transparent_28rem),linear-gradient(180deg,#f8fafc_0%,#eef3f7_100%)] px-4 py-8">
      <section className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10">
        <div className="grid gap-6 p-7 sm:p-12">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-base tracking-normal text-white">
              CP
            </span>
            CardPulse
          </div>

          <div className="grid gap-4">
            <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-7xl">
              Storefront under maintenance.
            </h1>
            <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              We are preparing the public CardPulse storefront. The vendor admin
              system remains available for authorized users.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Open admin
            </Link>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5 text-sm sm:px-12">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Status
            </span>
            <span className="font-black text-slate-950">Maintenance mode</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Admin system
            </span>
            <span className="font-black text-slate-950">Available at /admin</span>
          </div>
        </div>
      </section>
    </main>
  );
}
