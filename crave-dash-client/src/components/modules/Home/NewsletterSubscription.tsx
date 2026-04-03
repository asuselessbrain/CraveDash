import Image from "next/image";
import { BadgePercent, CalendarDays, Mail, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const benefits = [
	{
		title: "Weekly Deals",
		description: "Fresh discounts dropped every week.",
		icon: CalendarDays,
	},
	{
		title: "New Restaurants",
		description: "Get first updates when new kitchens join.",
		icon: Store,
	},
	{
		title: "Special Discounts",
		description: "Exclusive promo codes only for subscribers.",
		icon: BadgePercent,
	},
];

export default function NewsletterSubscription() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="relative overflow-hidden rounded-[2rem] border border-orange-200/70 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20">
				<Image
					src="/newsletter/food-pattern.svg"
					alt="Food pattern background"
					fill
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-white/78 dark:bg-slate-900/78" />

				<div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div>
						<h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
							Stay Updated with Delicious Deals
						</h2>
						<p className="mt-3 text-base text-slate-600 sm:text-lg dark:text-slate-300">
							Subscribe to get exclusive offers & updates
						</p>

						<form className="mt-6 flex flex-col gap-3 sm:flex-row" action="#" method="post">
							<div className="relative flex-1">
								<Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									type="email"
									name="email"
									placeholder="Enter your email"
									className="h-11 rounded-xl border-white/80 bg-white pl-9 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								/>
							</div>

							<Button className="h-11 rounded-xl bg-orange-500 px-6 font-semibold text-white hover:bg-orange-400">
								Subscribe
							</Button>
						</form>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
						{benefits.map((benefit) => {
							const Icon = benefit.icon;

							return (
								<article
									key={benefit.title}
									className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70"
								>
									<div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
										<Icon className="h-4 w-4" />
									</div>
									<h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{benefit.title}</h3>
									<p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{benefit.description}</p>
								</article>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
