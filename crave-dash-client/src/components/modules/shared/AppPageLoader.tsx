type AppPageLoaderProps = {
  title?: string;
  subtitle?: string;
  cardCount?: number;
};

export default function AppPageLoader({
  title = "Loading your experience",
  subtitle = "Preparing data and interface...",
  cardCount = 6,
}: AppPageLoaderProps) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-orange-100 dark:bg-orange-500/15">
            <span className="absolute inset-0 animate-spin rounded-2xl border-2 border-transparent border-t-orange-500 border-r-orange-300" />
            <span className="absolute inset-3 rounded-lg bg-orange-500/70 dark:bg-orange-400/70" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-10 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-900/90"
          >
            <div className="h-32 animate-pulse bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-9 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
