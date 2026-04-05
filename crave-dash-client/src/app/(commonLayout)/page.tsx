
import Image from "next/image";
import Link from "next/link";

import Banner from "@/components/modules/Home/Banner";
import CategoryCarousel from "@/components/modules/Home/CategoryCarousel";
import CuisineExplorer from "@/components/modules/Home/CuisineExplorer";
import DownloadAppSection from "@/components/modules/Home/DownloadAppSection";
import FlashDeals from "@/components/modules/Home/FlashDeals";
import NewsletterSubscription from "@/components/modules/Home/NewsletterSubscription";
import StatsBar from "@/components/modules/Home/StatsBar";
import TopRatedProvider from "@/components/modules/Home/TopRatedProvider";
import TrendingNow from "@/components/modules/Home/TrendingNow";
import LiveOrderStats from "@/components/modules/Home/LiveOrderStats";


export default function HomePage() {
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
                            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 sm:h-44 dark:border-white/15">
                                <Image src="/categories/pizza.svg" alt="Featured pizza" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                            </div>
                            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 sm:h-44 dark:border-white/15">
                                <Image src="/categories/biryani.svg" alt="Featured biryani" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                            </div>
                            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 sm:h-44 dark:border-white/15">
                                <Image src="/categories/chinese.svg" alt="Featured chinese" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                            </div>
                            <div className="relative h-36 overflow-hidden rounded-2xl border border-white/60 sm:h-44 dark:border-white/15">
                                <Image src="/categories/desserts.svg" alt="Featured desserts" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FlashDeals />
            <LiveOrderStats />
            <TrendingNow />
            <CuisineExplorer />
            <TopRatedProvider />
            <DownloadAppSection />
            <NewsletterSubscription />
        </main>
    );
}
