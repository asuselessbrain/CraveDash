import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Pizza", slug: "pizza", image: "/categories/pizza.svg" },
  { name: "Burger", slug: "burger", image: "/categories/burger.svg" },
  { name: "Biryani", slug: "biryani", image: "/categories/biryani.svg" },
  { name: "Chinese", slug: "chinese", image: "/categories/chinese.svg" },
  { name: "Desserts", slug: "desserts", image: "/categories/desserts.svg" },
  { name: "Drinks", slug: "drinks", image: "/categories/drinks.svg" },
  { name: "BBQ", slug: "bbq", image: "/categories/bbq.svg" },
  { name: "Steak", slug: "steak", image: "/categories/steak.svg" },
];

const loopedCategories = [...categories, ...categories];

export default function CategoryCarousel() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            What&apos;s On Your Mind?
          </h2>
        </div>

        <div className="group relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-orange-50 to-transparent dark:from-slate-900" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-rose-50 to-transparent dark:from-slate-800" />

          <div className="category-marquee-track group-hover:[animation-play-state:paused]">
            {loopedCategories.map((category, index) => (
              <Link
                key={`${category.slug}-${index}`}
                href={`/browse?category=${category.slug}`}
                className="group/card relative flex min-w-52 shrink-0 items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-2 text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:text-orange-700 hover:shadow-xl hover:shadow-orange-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-orange-400/70 dark:hover:bg-slate-900 dark:hover:text-orange-200"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/80">
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    sizes="56px"
                    className="object-cover transition duration-300 group-hover/card:scale-110"
                  />
                </div>

                <div className="min-w-0">
                  <span className="block text-sm font-bold tracking-wide">{category.name}</span>
                  <span className="block text-xs text-slate-500 transition group-hover/card:text-orange-500 dark:text-slate-400 dark:group-hover/card:text-orange-300">
                    Explore meals
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
