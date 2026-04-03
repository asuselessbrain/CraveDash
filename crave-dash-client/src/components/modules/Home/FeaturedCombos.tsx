import Image from "next/image";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";

type Combo = {
	id: number;
	name: string;
	image: string;
	items: string[];
	originalTotal: number;
	bundlePrice: number;
};

const combos: Combo[] = [
	{
		id: 1,
		name: "Family Feast",
		image: "/categories/pizza.svg",
		items: ["2 Large Pizzas", "2 Burgers", "4 Drinks"],
		originalTotal: 49.99,
		bundlePrice: 36.99,
	},
	{
		id: 2,
		name: "Couple's Special",
		image: "/categories/biryani.svg",
		items: ["2 Biryani Bowls", "1 Dessert", "2 Mocktails"],
		originalTotal: 33.49,
		bundlePrice: 24.99,
	},
	{
		id: 3,
		name: "Game Night Pack",
		image: "/categories/bbq.svg",
		items: ["BBQ Wings Bucket", "Chili Noodles", "2 Cold Drinks"],
		originalTotal: 38.99,
		bundlePrice: 28.49,
	},
	{
		id: 4,
		name: "Steakhouse Duo",
		image: "/categories/steak.svg",
		items: ["2 Grilled Steaks", "Cheesecake", "2 Lemonades"],
		originalTotal: 46.5,
		bundlePrice: 34.99,
	},
];

export default function FeaturedCombos() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="mb-6">
				<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
					💰 Save More with Combo Deals
				</h2>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
				{combos.map((combo) => (
					<article
						key={combo.id}
						className="group overflow-hidden rounded-3xl border border-slate-200/75 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-700 dark:bg-slate-900/90"
					>
						<div className="relative h-44 overflow-hidden rounded-xl">
							<Image
								src={combo.image}
								alt={`${combo.name} combo image`}
								fill
								sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
								className="object-cover transition duration-500 group-hover:scale-105"
							/>
						</div>

						<h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{combo.name}</h3>

						<ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
							{combo.items.map((item) => (
								<li key={`${combo.id}-${item}`} className="flex items-center gap-2">
									<Tag className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
									<span>{item}</span>
								</li>
							))}
						</ul>

						<div className="mt-4 flex items-end gap-2">
							<span className="text-sm text-slate-500 line-through dark:text-slate-400">${combo.originalTotal.toFixed(2)}</span>
							<span className="text-xl font-extrabold text-orange-600 dark:text-orange-300">${combo.bundlePrice.toFixed(2)}</span>
						</div>

						<Button className="mt-4 h-10 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-400">
							Order Combo
						</Button>
					</article>
				))}
			</div>
		</section>
	);
}
