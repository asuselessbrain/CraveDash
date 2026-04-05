import Image from "next/image";
import Link from "next/link";
import { Bike, Store, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

type Provider = {
	id: number;
	slug: string;
	name: string;
	image: string;
	rating: number;
	reviews: number;
	deliveryTime: string;
	popularMeals: [string, string?];
};

const providers: Provider[] = [
	{
		id: 1,
		slug: "pizza-palace",
		name: "Pizza Palace",
		image: "/categories/pizza.svg",
		rating: 4.8,
		reviews: 1480,
		deliveryTime: "25-30 min",
		popularMeals: ["Truffle Pizza", "Pepperoni Feast"],
	},
	{
		id: 2,
		slug: "burger-hub",
		name: "Burger Hub",
		image: "/categories/burger.svg",
		rating: 4.7,
		reviews: 1210,
		deliveryTime: "20-28 min",
		popularMeals: ["Smash Burger", "Cheese Bomb"],
	},
	{
		id: 3,
		slug: "biryani-ghor",
		name: "Biryani Ghor",
		image: "/categories/biryani.svg",
		rating: 4.9,
		reviews: 2034,
		deliveryTime: "30-38 min",
		popularMeals: ["Kacchi Biryani", "Chicken Roast Combo"],
	},
	{
		id: 4,
		slug: "wok-street",
		name: "Wok Street",
		image: "/categories/chinese.svg",
		rating: 4.6,
		reviews: 932,
		deliveryTime: "22-30 min",
		popularMeals: ["Szechuan Noodles", "Crispy Chicken"],
	},
	{
		id: 5,
		slug: "sweet-room",
		name: "Sweet Room",
		image: "/categories/desserts.svg",
		rating: 4.8,
		reviews: 865,
		deliveryTime: "18-25 min",
		popularMeals: ["Choco Lava Jar", "Red Velvet Slice"],
	},
	{
		id: 6,
		slug: "grill-yard",
		name: "Grill Yard",
		image: "/categories/bbq.svg",
		rating: 4.7,
		reviews: 1104,
		deliveryTime: "28-35 min",
		popularMeals: ["BBQ Wings", "Smoked Platter"],
	},
];

const loopedProviders = [...providers, ...providers];

export default function TopRatedProvider() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<div className="mb-6 flex items-center justify-between gap-3">
					<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
						⭐ Top Rated Restaurants Near You
					</h2>
				</div>

				<div className="group relative overflow-hidden pb-2">
					<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-orange-50 to-transparent dark:from-slate-900" />
					<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-rose-50 to-transparent dark:from-slate-800" />

					<div className="provider-marquee-track group-hover:paused">
					{loopedProviders.map((provider, index) => (
						<article
							key={`${provider.slug}-${index}`}
							className="w-70 shrink-0 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-700 dark:bg-slate-900/85"
						>
							<div className="flex items-center gap-3">
								<div className="relative h-12 w-12 overflow-hidden rounded-full border border-orange-100 bg-white">
									<Image
										src={provider.image}
										alt={`${provider.name} logo`}
										fill
										sizes="48px"
										className="object-cover"
									/>
								</div>

								<div className="min-w-0">
									<h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">{provider.name}</h3>
									<div className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
										<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
										<span className="font-semibold">{provider.rating}</span>
										<span>({provider.reviews})</span>
									</div>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
								<Bike className="h-4 w-4" />
								<span>{provider.deliveryTime}</span>
							</div>

							<div className="mt-4">
								<p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Popular</p>
								<ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
									{provider.popularMeals.map((meal) => (
										<li key={`${provider.id}-${meal}`} className="flex items-center gap-2">
											<Store className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
											<span>{meal}</span>
										</li>
									))}
								</ul>
							</div>

							<Button asChild className="mt-5 h-10 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-400">
								<Link href={`/providers/${provider.slug}`}>View Menu</Link>
							</Button>
						</article>
					))}
					</div>
				</div>
			</div>
		</section>
	);
}
