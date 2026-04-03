"use client";

import { useEffect, useRef, useState } from "react";
import { Bike, Search, ShoppingBag } from "lucide-react";

const steps = [
	{
		id: 1,
		title: "Browse & Choose",
		description: "Search from top restaurants, compare meals, and pick exactly what matches your craving.",
		icon: Search,
	},
	{
		id: 2,
		title: "Add to Cart",
		description: "Customize your order, add items in one tap, and confirm securely in seconds.",
		icon: ShoppingBag,
	},
	{
		id: 3,
		title: "Get Delivered",
		description: "Track your rider live and receive fresh food right at your doorstep, fast.",
		icon: Bike,
	},
];

export default function HowItWork() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	return (
		<section ref={sectionRef} className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="bg-white/75 p-6 shadow-sm backdrop-blur-sm sm:p-8">
				<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
					Order in 3 Simple Steps
				</h2>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
					{steps.map((step, index) => {
						const Icon = step.icon;

						return (
							<article
								key={step.id}
								className={`rounded-2xl border border-slate-200/80 bg-linear-to-br from-orange-50 to-amber-50 p-5 transition-all duration-700 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 ${
									isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
								}`}
								style={{ transitionDelay: `${index * 140}ms` }}
							>
								<div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
									<Icon className="h-5 w-5" />
								</div>

								<h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
									Step {step.id}: {step.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
