
const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Meals Available" },
  { value: "120+", label: "Restaurants" },
  { value: "50K+", label: "Orders Delivered" },
];

export default function StatsBar() {
    return (
        <section className="bg-secondary">
            <div className="py-8 max-w-360 mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="font-display text-3xl font-extrabold text-primary">{stat.value}</p>
                            <p className="text-sm text-secondary-foreground/70">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
