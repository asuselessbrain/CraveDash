import Image from "next/image";
import { Building2, Star, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type TrendingMeal = {
	id: number;
	name: string;
	image: string;
	rating: number;
	reviews: number;
	provider: string;
	price: number;
};

const trendingMeals: TrendingMeal[] = [
	{ id: 1, name: "Truffle Cheese Pizza", image: "/categories/pizza.svg", rating: 4.8, reviews: 1324, provider: "Pizza Palace", price: 12.99 },
	{ id: 2, name: "Crispy Smash Burger", image: "/categories/burger.svg", rating: 4.7, reviews: 987, provider: "Burger Hub", price: 9.49 },
	{ id: 3, name: "Royal Kacchi Biryani", image: "/categories/biryani.svg", rating: 4.9, reviews: 1560, provider: "Biryani Ghar", price: 11.99 },
	{ id: 4, name: "Szechuan Noodle Bowl", image: "/categories/chinese.svg", rating: 4.6, reviews: 841, provider: "Wok Street", price: 10.49 },
	{ id: 5, name: "Molten Chocolate Jar", image: "/categories/desserts.svg", rating: 4.8, reviews: 743, provider: "Sweet Room", price: 6.99 },
	{ id: 6, name: "Berry Chill Smoothie", image: "/categories/drinks.svg", rating: 4.5, reviews: 519, provider: "Juice Point", price: 4.99 },
	{ id: 7, name: "Smoked BBQ Wings", image: "/categories/bbq.svg", rating: 4.7, reviews: 678, provider: "Grill Yard", price: 13.49 },
	{ id: 8, name: "Garlic Butter Steak", image: "/categories/steak.svg", rating: 4.9, reviews: 904, provider: "Prime Cut", price: 17.99 },
];

function renderStars(rating: number) {
	return Array.from({ length: 5 }).map((_, index) => {
		const filled = index < Math.round(rating);

		return (
			<Star
				key={`${rating}-${index}`}
				className={`h-3.5 w-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
			/>
		);
	});
}

export default function TrendingNow() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<div className="mb-6 flex items-center justify-between gap-3">
					<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
						🔥 Trending This Week
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
				{trendingMeals.map((meal) => (
					<article
						key={meal.id}
						className="group overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-700 dark:bg-slate-900/85"
					>
						<div className="relative h-42 overflow-hidden">
							<Image
								src={meal.image}
								alt={meal.name}
								fill
								sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
								className="object-cover transition duration-500 group-hover:scale-110"
							/>
						</div>

						<div className="p-4">
							<div className="flex items-center gap-1">
								{renderStars(meal.rating)}
								<span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">({meal.reviews})</span>
							</div>

							<h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{meal.name}</h3>

							<div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
								<Building2 className="h-4 w-4 text-orange-500 dark:text-orange-300" />
								<span>{meal.provider}</span>
							</div>

							<div className="mt-4 flex items-center justify-between gap-2">
								<p className="text-lg font-extrabold text-orange-600 dark:text-orange-300">${meal.price.toFixed(2)}</p>

								<Button size="sm" className="rounded-full bg-orange-500 px-4 text-white hover:bg-orange-400">
									<Plus className="h-4 w-4" />
									Quick Add
								</Button>
							</div>
						</div>
					</article>
				))}
				</div>
			</div>
		</section>
	);
}
