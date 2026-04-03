import Link from "next/link";
import { Clock3, Flame, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

import Banner from "@/components/modules/Home/Banner";
import CategoryCarousel from "@/components/modules/Home/CategoryCarousel";
import CuisineExplorer from "@/components/modules/Home/CuisineExplorer";
import DownloadAppSection from "@/components/modules/Home/DownloadAppSection";
import FeaturedCombos from "@/components/modules/Home/FeaturedCombos";
import FlashDeals from "@/components/modules/Home/FlashDeals";
import HowItWork from "@/components/modules/Home/HowItWork";
import LiveOrderStats from "@/components/modules/Home/LiveOrderStats";
import NewsletterSubscription from "@/components/modules/Home/NewsletterSubscription";
import StatsBar from "@/components/modules/Home/StatsBar";
import TopRatedProvider from "@/components/modules/Home/TopRatedProvider";
import TrendingNow from "@/components/modules/Home/TrendingNow";

const valuePoints = [
    {
        title: "Delivery in 30 minutes",
        description: "Smart route batching gets your meal to you while it is still steaming.",
        icon: Truck,
    },
    {
        title: "Chef-curated restaurants",
        description: "Only top-rated kitchens with consistently high customer feedback.",
        icon: Star,
    },
    {
        title: "Safe checkout",
        description: "Encrypted payments and real-time order tracking from kitchen to door.",
        icon: ShieldCheck,
    },
];

const featureCards = [
    {
        title: "Live Kitchen Timeline",
        text: "Track every stage from confirmed order to rider pickup without refreshing the page.",
        icon: Clock3,
    },
    {
        title: "Flavor Match",
        text: "Personalized recommendations based on your spice level, diet, and cravings.",
        icon: Sparkles,
    },
    {
        title: "Hot Deals Radar",
        text: "Get instant alerts for flash discounts from nearby restaurants during peak hours.",
        icon: Flame,
    },
];

export default function HomePage() {
    return (
        <main className="overflow-x-clip pb-20 text-slate-900 dark:text-slate-100">
            <Banner />
            <StatsBar />
            <CategoryCarousel />
            <FlashDeals />
            <TrendingNow />
            <TopRatedProvider />
            <HowItWork />
            <CuisineExplorer />
            <FeaturedCombos />
            <LiveOrderStats />
            <DownloadAppSection />
            <NewsletterSubscription />

            <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {valuePoints.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className="landing-reveal group rounded-3xl border border-slate-200/75 bg-white/75 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-700/70 dark:bg-slate-900/65"
                                style={{ animationDelay: `${0.2 + index * 0.12}s` }}
                            >
                                <Icon className="mb-4 h-6 w-6 text-orange-600 transition group-hover:scale-110 dark:text-orange-300" />
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-200/70 bg-linear-to-br from-amber-50/90 to-orange-100/75 p-6 sm:p-8 md:p-10 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
                    <p className="text-xs font-semibold tracking-[0.13em] text-orange-700 uppercase dark:text-orange-300">What makes CraveDash different</p>
                    <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Every order feels like your favorite restaurant knows you personally.</h3>

                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {featureCards.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="landing-reveal rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/65"
                                    style={{ animationDelay: `${0.25 + index * 0.12}s` }}
                                >
                                    <Icon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                                    <h4 className="mt-3 text-lg font-semibold">{feature.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.text}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="landing-reveal rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12 dark:bg-slate-950">
                    <p className="text-sm tracking-[0.12em] text-orange-300 uppercase">Ready to order?</p>
                    <h5 className="mt-3 max-w-2xl text-3xl font-bold text-balance sm:text-4xl">Join thousands of food lovers who skip waiting and start eating faster.</h5>

                    <div className="mt-7 flex flex-wrap gap-4">
                        <Link
                            href="/sign-up"
                            className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-7 text-sm font-bold text-white transition hover:bg-orange-400"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/sign-in"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-orange-300 hover:text-orange-200"
                        >
                            I Have an Account
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
