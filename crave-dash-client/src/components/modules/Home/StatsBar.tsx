
const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Meals Available" },
  { value: "120+", label: "Restaurants" },
  { value: "50K+", label: "Orders Delivered" },
];

export default function StatsBar() {
    return (
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-slate-200/75 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 shadow-lg shadow-slate-950/10 dark:border-slate-700 sm:px-8">
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
                        >
                            <p className="font-display text-3xl font-extrabold text-white">{stat.value}</p>
                            <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
