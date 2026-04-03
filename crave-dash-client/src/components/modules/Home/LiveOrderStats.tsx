"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Building2, MapPin, ShoppingBag, Users } from "lucide-react";

type Stat = {
	label: string;
	value: number;
	suffix: string;
	icon: ComponentType<{ className?: string }>;
};

const stats: Stat[] = [
	{ label: "Total Orders Delivered", value: 50000, suffix: "+", icon: ShoppingBag },
	{ label: "Active Restaurants", value: 500, suffix: "+", icon: Building2 },
	{ label: "Happy Customers", value: 25000, suffix: "+", icon: Users },
	{ label: "Cities Covered", value: 15, suffix: "+", icon: MapPin },
];

function formatCount(value: number) {
	return value.toLocaleString("en-US");
}

export default function LiveOrderStats() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [hasStarted, setHasStarted] = useState(false);
	const [counts, setCounts] = useState(() => stats.map(() => 0));

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					setHasStarted(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.25 }
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!hasStarted) return;

		const duration = 1300;
		const start = performance.now();

		let frameId = 0;
		const animate = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			setCounts(stats.map((stat) => Math.floor(stat.value * progress)));

			if (progress < 1) {
				frameId = requestAnimationFrame(animate);
			}
		};

		frameId = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(frameId);
	}, [hasStarted]);

	return (
		<section ref={sectionRef} className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="rounded-[2rem] border border-slate-200/75 bg-linear-to-br from-orange-50/70 to-amber-50/70 p-6 sm:p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
				<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
					Join Thousands of Happy Customers
				</h2>

				<div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{stats.map((stat, index) => {
						const Icon = stat.icon;

						return (
							<article
								key={stat.label}
								className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
							>
								<Icon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
								<p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
									{formatCount(counts[index])}
									{stat.suffix}
								</p>
								<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
