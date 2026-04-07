export default function ProviderCuisinesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 rounded bg-orange-200/70 dark:bg-orange-400/20" />
          <div className="h-9 w-52 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-11 w-36 rounded-xl bg-orange-200/70 dark:bg-orange-400/20" />
      </header>

      <div className="h-12 w-full max-w-xl rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white/90 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90"
          >
            <div className="h-32 w-full bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="h-8 flex-1 rounded-xl bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
