import Image from "next/image";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-10">
      <section className="grid w-full max-w-4xl justify-items-center gap-8 text-center">
        <Image
          src="/logo.png"
          alt="CardPulse"
          width={1536}
          height={1024}
          priority
          className="h-auto w-full max-w-2xl"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Under maintenance
        </h1>
      </section>
    </main>
  );
}
