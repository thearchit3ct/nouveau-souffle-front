import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 py-32 px-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Nouveau Souffle
        </h1>
        <p className="max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
          Plateforme associative de gestion et de mise en relation.
        </p>
        <div className="flex gap-4">
          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            En construction
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            S&apos;inscrire
          </Link>
        </div>
      </main>
    </div>
  );
}
