import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Twitter } from "lucide-react";

const quickLinks = [
	{ label: "Home", href: "/" },
	{ label: "Browse Meals", href: "/browse" },
	{ label: "Top Restaurants", href: "/browse" },
	{ label: "Offers", href: "/browse" },
];

const supportLinks = [
	{ label: "Help Center", href: "/" },
	{ label: "Track Order", href: "/" },
	{ label: "Privacy Policy", href: "/" },
	{ label: "Terms & Conditions", href: "/" },
];

const socialLinks = [
	{ label: "Facebook", href: "#", icon: Facebook },
	{ label: "Instagram", href: "#", icon: Instagram },
	{ label: "Twitter", href: "#", icon: Twitter },
];

export default function Footer() {
	return (
		<footer className="relative mt-20 border-t border-orange-200/70 bg-linear-to-b from-orange-50/80 via-amber-50/50 to-white dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-orange-100/40 to-transparent dark:from-orange-500/5" />

			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">CraveDash</h3>
						<p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
							Discover top food spots, grab exclusive deals, and get your cravings delivered fast.
						</p>

						<div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
							<p className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-orange-600 dark:text-orange-300" />
								Dhaka, Bangladesh
							</p>
							<p className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-orange-600 dark:text-orange-300" />
								+880 1234 567890
							</p>
						</div>
					</div>

					<div>
						<h4 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Quick Links</h4>
						<ul className="mt-4 space-y-2">
							{quickLinks.map((item) => (
								<li key={item.label}>
									<Link href={item.href} className="text-sm text-slate-600 transition hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-300">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Support</h4>
						<ul className="mt-4 space-y-2">
							{supportLinks.map((item) => (
								<li key={item.label}>
									<Link href={item.href} className="text-sm text-slate-600 transition hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-300">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Follow Us</h4>
						<div className="mt-4 flex items-center gap-3">
							{socialLinks.map((item) => {
								const Icon = item.icon;

								return (
									<Link
										key={item.label}
										href={item.href}
										aria-label={item.label}
										className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-300"
									>
										<Icon className="h-4 w-4" />
									</Link>
								);
							})}
						</div>

						<p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
							Download our app for app-only deals and faster checkout.
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-slate-200 pt-5 dark:border-slate-700">
					<p className="text-center text-xs text-slate-500 dark:text-slate-400">
						Copyright {new Date().getFullYear()} CraveDash. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
