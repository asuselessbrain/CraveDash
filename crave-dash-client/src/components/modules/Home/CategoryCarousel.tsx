import Link from "next/link";
import Image from "next/image";
import { getCategoryForSlider } from "@/services/category";


export default async function CategoryCarousel() {
  const categories = await getCategoryForSlider();
  const categoryItems = categories.data ?? [];
  const loopedCategories = [...categoryItems, ...categoryItems, ...categoryItems, ...categoryItems, ...categoryItems, ...categoryItems, ...categoryItems]; // Loop categories to create a seamless marquee effect
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            What&apos;s On Your Mind?
          </h2>
        </div>

        {categoryItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
            No categories available in the database yet.
          </div>
        ) : (
        <div className="group relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-orange-50 to-transparent dark:from-slate-900" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-rose-50 to-transparent dark:from-slate-800" />

          <div className="category-marquee-track group-hover:paused">
            {loopedCategories.map((category, index) => (
              <Link
                key={`${category.id}-${index}`}
                href={`/browse?category=${category.id}`}
                className="group/card relative flex min-w-40 shrink-0 items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-2 text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:text-orange-700 hover:shadow-xl hover:shadow-orange-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:min-w-52 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-orange-400/70 dark:hover:bg-slate-900 dark:hover:text-orange-200"
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
        )}
      </div>
    </section>
  );
}
