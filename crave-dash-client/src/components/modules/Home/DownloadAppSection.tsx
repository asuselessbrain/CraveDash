import Image from "next/image";
import Link from "next/link";
import { Apple, Bell, CreditCard, Download, Play, ShieldCheck } from "lucide-react";

const appFeatures = [
	{
		title: "Push Notifications",
		description: "Get live order updates and flash deal alerts instantly.",
		icon: Bell,
	},
	{
		title: "Faster Checkout",
		description: "Saved addresses and one-tap reorders in seconds.",
		icon: CreditCard,
	},
	{
		title: "Secure Experience",
		description: "Safe payment flow with trusted transaction protection.",
		icon: ShieldCheck,
	},
];

export default function DownloadAppSection() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div>
						<h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
							Get the App for Better Experience
						</h2>
						<p className="mt-3 text-base text-slate-600 sm:text-lg dark:text-slate-300">
							Exclusive app-only deals & faster checkout
						</p>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								href="#"
								className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
							>
								<Apple className="h-4 w-4" />
								App Store
							</Link>
							<Link
								href="#"
								className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-400"
							>
								<Play className="h-4 w-4" />
								Play Store
							</Link>
						</div>

						<div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
							{appFeatures.map((feature) => {
								const Icon = feature.icon;

								return (
									<article
										key={feature.title}
										className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70"
									>
										<Icon className="h-5 w-5 text-orange-600 dark:text-orange-300" />
										<h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{feature.title}</h3>
										<p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{feature.description}</p>
									</article>
								);
							})}
						</div>
					</div>

					<div className="relative flex items-end justify-center gap-4">
						<div className="relative hidden h-68 w-32 overflow-hidden rounded-3xl border border-white/70 shadow-lg sm:block">
							<Image
								src="/app/phone-mockup-side.svg"
								alt="CraveDash app side preview"
								fill
								sizes="128px"
								className="object-cover"
							/>
						</div>

						<div className="relative h-80 w-38 overflow-hidden rounded-[2rem] border border-white/70 shadow-2xl shadow-orange-500/20 sm:h-96 sm:w-46">
							<Image
								src="/app/phone-mockup-main.svg"
								alt="CraveDash app main preview"
								fill
								sizes="184px"
								className="object-cover"
							/>
						</div>

						<div className="absolute right-0 bottom-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
							<Image
								src="/app/download-qr.svg"
								alt="QR code to download CraveDash app"
								width={84}
								height={84}
								className="h-21 w-21"
							/>
							<div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
								<Download className="h-3 w-3" />
								Scan to install
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
