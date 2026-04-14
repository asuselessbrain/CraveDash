
import Image from "next/image";
import Link from "next/link";

import Banner from "@/components/modules/Home/Banner";
import CategoryCarousel from "@/components/modules/Home/CategoryCarousel";
import CuisineExplorer from "@/components/modules/Home/CuisineExplorer";
import DownloadAppSection from "@/components/modules/Home/DownloadAppSection";
import NewsletterSubscription from "@/components/modules/Home/NewsletterSubscription";
import TrendingNow from "@/components/modules/Home/TrendingNow";
import LiveOrderStats from "@/components/modules/Home/LiveOrderStats";
import { getMeals } from "@/services/meal";
import { getCuisinesForFiltering } from "@/services/cuisine";
import { getCategoryForSlider } from "@/services/category";

type HomeMeal = {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    image?: string;
    images?: string[];
    rating?: number | string;
    reviews?: number | string;
    provider?: string;
    providerName?: string;
    price?: number | string;
    discount?: number | string;
    preparationTime?: number | string;
};

type HomeCuisine = {
    id?: string;
    _id?: string;
    name?: string;
    image?: string;
    meals?: number;
    mealsCount?: number;
    categories?: number;
    categoriesCount?: number;
};

type HomeCategory = {
    id?: string;
    _id?: string;
    name?: string;
};

function toNumber(value: unknown, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function getArrayData<T>(response: unknown): T[] {
    const data = (response as { data?: { data?: T[] } | T[] })?.data;

    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { data?: T[] }).data)) {
        return (data as { data?: T[] }).data ?? [];
    }

    return [];
}

function getTotalMeta(response: unknown): number {
    const total = (response as { data?: { meta?: { total?: number } } })?.data?.meta?.total;
    return Number(total ?? 0) || 0;
}


export default async function HomePage() {
    const [trendingResponse, poolResponse, cuisinesResponse, categoriesResponse] = await Promise.all([
        getMeals({ sortBy: "rating", sortOrder: "desc", take: 8, skip: 0 }),
        getMeals({ sortBy: "createdAt", sortOrder: "desc", take: 60, skip: 0 }),
        getCuisinesForFiltering(),
        getCategoryForSlider(),
    ]);

    const trendingMealsRaw = getArrayData<HomeMeal>(trendingResponse);
    const poolMeals = getArrayData<HomeMeal>(poolResponse);
    const cuisinesRaw = getArrayData<HomeCuisine>(cuisinesResponse);
    const categoriesRaw = getArrayData<HomeCategory>(categoriesResponse);

    const trendingMeals = trendingMealsRaw.slice(0, 8).map((meal, index) => ({
        id: meal.id || meal._id || `trend-${index + 1}`,
        name: meal.name || meal.title || `Trending meal ${index + 1}`,
        image: meal.image || meal.images?.[0] || "/categories/pizza.svg",
        rating: Math.max(0, Math.min(5, toNumber(meal.rating, 4.5))),
        reviews: Math.max(50, Math.round(toNumber(meal.reviews, 120 + index * 15))),
        provider: meal.providerName || meal.provider || "CraveDash Kitchen",
        price: toNumber(meal.price, 0),
    }));

    const cuisineCards = cuisinesRaw.slice(0, 8).map((cuisine, index) => {
        const mealsCount = Math.max(0, Number(cuisine.mealsCount ?? cuisine.meals ?? 0));
        const matchingMeals = poolMeals
            .filter((meal) => {
                const providerName = (meal.providerName || meal.provider || "").toLowerCase();
                return providerName.includes((cuisine.name || "").toLowerCase());
            })
            .slice(0, 2)
            .map((meal) => meal.name || meal.title)
            .filter((name): name is string => Boolean(name));

        return {
            id: cuisine.id || cuisine._id || `cuisine-${index + 1}`,
            slug: toSlug(cuisine.name || `cuisine-${index + 1}`),
            name: cuisine.name || `Cuisine ${index + 1}`,
            image: cuisine.image || "/cuisines/italian.svg",
            dishes: `${mealsCount}+ dishes`,
            samples: matchingMeals.length ? matchingMeals : ["Chef special", "Popular picks"],
        };
    });

    const providerMap = new Map<string, {
        name: string;
        image: string;
        ratings: number[];
        prepTimes: number[];
        meals: Set<string>;
    }>();

    poolMeals.forEach((meal) => {
        const providerName = meal.providerName || meal.provider || "CraveDash Kitchen";
        const key = providerName.toLowerCase();

        if (!providerMap.has(key)) {
            providerMap.set(key, {
                name: providerName,
                image: meal.image || meal.images?.[0] || "/categories/pizza.svg",
                ratings: [],
                prepTimes: [],
                meals: new Set<string>(),
            });
        }

        const entry = providerMap.get(key)!;
        entry.ratings.push(toNumber(meal.rating, 4.5));
        entry.prepTimes.push(toNumber(meal.preparationTime, 28));
        const mealName = meal.name || meal.title;
        if (mealName) entry.meals.add(mealName);
    });

    const topProviders = Array.from(providerMap.values())
        .sort((a, b) => {
            const aRating = a.ratings.reduce((sum, item) => sum + item, 0) / Math.max(1, a.ratings.length);
            const bRating = b.ratings.reduce((sum, item) => sum + item, 0) / Math.max(1, b.ratings.length);
            return bRating - aRating;
        })
        .slice(0, 6)
        .map((provider, index) => {
            const avgRating = provider.ratings.reduce((sum, item) => sum + item, 0) / Math.max(1, provider.ratings.length);
            const avgPrep = provider.prepTimes.reduce((sum, item) => sum + item, 0) / Math.max(1, provider.prepTimes.length);
            const roundedPrep = Math.max(15, Math.round(avgPrep));

            return {
                id: `${index + 1}`,
                slug: toSlug(provider.name),
                name: provider.name,
                image: provider.image,
                rating: Math.max(0, Math.min(5, Number(avgRating.toFixed(1)))),
                reviews: 180 + provider.ratings.length * 24,
                deliveryTime: `${Math.max(12, roundedPrep - 6)}-${roundedPrep + 4} min`,
                popularMeals: Array.from(provider.meals).slice(0, 2) as [string, string?],
            };
        });

    const liveStats = [
        { label: "Meals Listed", value: Math.max(poolMeals.length, getTotalMeta(poolResponse), 1), suffix: "+" },
        { label: "Cuisine Types", value: Math.max(cuisinesRaw.length, 1), suffix: "+" },
        { label: "Food Categories", value: Math.max(categoriesRaw.length, 1), suffix: "+" },
        { label: "Top Providers", value: Math.max(topProviders.length, 1), suffix: "+" },
    ];

    const heroImages = trendingMeals.slice(0, 4).map((meal) => ({
        src: meal.image,
        alt: meal.name,
    }));

    const heroFallback = [
        { src: "https://res.cloudinary.com/dwduymu1l/image/upload/v1775661389/easy_pizza_recipe_800x800_bhqbz3.webp", alt: "Featured pizza" },
        { src: "https://res.cloudinary.com/dwduymu1l/image/upload/v1775661388/mutton-biriyani__570x380_x1hh5b.jpg", alt: "Featured biryani" },
        { src: "https://res.cloudinary.com/dwduymu1l/image/upload/v1775661597/81240320007-99-65364_ahmema.webp", alt: "Featured chinese" },
        { src: "https://res.cloudinary.com/dwduymu1l/image/upload/v1775661388/feature-img-which-scooby-doo-character_lyqxmb.webp", alt: "Featured desserts" },
    ];

    const curatedImages = heroImages.length === 4 ? heroImages : heroFallback;

    return (
        <main className="food-landing-bg overflow-x-clip pb-20 text-slate-900 dark:text-slate-100">
            <Banner />
            <CategoryCarousel />
            <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-200/70 bg-linear-to-br from-orange-100 via-amber-50 to-rose-100 p-7 text-slate-900 shadow-xl shadow-orange-500/10 sm:p-10 lg:p-12 dark:border-slate-700 dark:bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:shadow-slate-950/20">
                    <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange-500/18 blur-3xl dark:bg-orange-500/20" />
                    <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-400/15" />

                    <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Curated experience</p>
                            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                Less scrolling. Better cravings. Smarter picks for every mood.
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                                Discover handpicked dishes, top restaurants, and weekly deals in one clean flow. Built to help you decide faster and order happier.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href="/browse"
                                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
                                >
                                    Explore Menu
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300/70 px-6 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700 dark:border-white/25 dark:text-white dark:hover:border-orange-300 dark:hover:text-orange-200"
                                >
                                    Join Now
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {curatedImages.map((item, index) => (
                                <div key={`${item.src}-${index}`} className="relative h-36 overflow-hidden rounded-2xl border border-white/60 sm:h-44 dark:border-white/15">
                                    <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* <FlashDeals deals={flashDeals} /> */}
            <TrendingNow meals={trendingMeals} />
            <LiveOrderStats items={liveStats} />
            <CuisineExplorer items={cuisineCards} />
            {/* <TopRatedProvider items={topProviders} /> */}
            <DownloadAppSection />
            <NewsletterSubscription />
        </main>
    );
}
