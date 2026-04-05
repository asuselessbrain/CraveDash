"use client";

import { CheckCircle2, Clock3, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
};

const orderItems: OrderItem[] = [
	{ id: "1", name: "Margherita Pizza", quantity: 1, price: 8.99 },
	{ id: "9", name: "Chocolate Lava Cake", quantity: 2, price: 5.99 },
	{ id: "11", name: "Mango Smoothie", quantity: 1, price: 4.49 },
];

export default function CheckoutPage() {
	const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const deliveryFee = 1.5;
	const tax = subtotal * 0.05;
	const total = subtotal + deliveryFee + tax;

	return (
		<main className="food-landing-bg">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<header className="mb-6">
					<p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Checkout</p>
					<h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Complete Your Order</h1>
				</header>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
					<div className="space-y-6">
						<div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
									<MapPin className="h-5 w-5" />
								</div>
								<div>
									<h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
									<p className="text-sm text-slate-500 dark:text-slate-400">Enter the address where you want the order delivered.</p>
								</div>
							</div>

							<form className="mt-6 grid gap-4 sm:grid-cols-2">
								<div className="sm:col-span-1">
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
									<Input placeholder="Your name" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
								</div>
								<div className="sm:col-span-1">
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
									<Input placeholder="01XXXXXXXXX" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
								</div>
								<div className="sm:col-span-2">
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Street Address</label>
									<Input placeholder="House no., road, area" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
								</div>
								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">City</label>
									<Input defaultValue="Dhaka" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
								</div>
								<div>
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Area</label>
									<Input placeholder="Dhanmondi, Banani..." className="h-11 rounded-xl bg-white dark:bg-slate-950" />
								</div>
								<div className="sm:col-span-2">
									<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Instructions</label>
									<textarea
										rows={4}
										placeholder="Any note for the rider"
										className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
									/>
								</div>
							</form>
						</div>

						<div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
									<PackageCheck className="h-5 w-5" />
								</div>
								<div>
									<h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Payment Method</h2>
									<p className="text-sm text-slate-500 dark:text-slate-400">Choose how you want to pay for this order.</p>
								</div>
							</div>

							<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
										<ShieldCheck className="h-5 w-5" />
									</div>
									<div>
										<p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Cash on Delivery</p>
										<p className="text-sm text-emerald-700/90 dark:text-emerald-200/80">Pay the rider when your order arrives.</p>
									</div>
								</div>
							</div>

							<div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
								<div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
									<Clock3 className="mb-2 h-4 w-4 text-orange-500" />
									Estimated 25-35 min
								</div>
								<div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
									<Truck className="mb-2 h-4 w-4 text-orange-500" />
									Live delivery tracking
								</div>
								<div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
									<CheckCircle2 className="mb-2 h-4 w-4 text-orange-500" />
									Order confirmation SMS
								</div>
							</div>
						</div>
					</div>

					<aside className="h-fit rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
						<h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>

						<div className="mt-5 space-y-4">
							{orderItems.map((item) => (
								<div key={item.id} className="flex items-start justify-between gap-3 border-b border-dashed border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700">
									<div>
										<p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
										<p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
									</div>
									<p className="font-semibold text-slate-900 dark:text-slate-100">${(item.price * item.quantity).toFixed(2)}</p>
								</div>
							))}
						</div>

						<div className="mt-5 space-y-3 text-sm">
							<div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
								<span>Subtotal</span>
								<span className="font-semibold">${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
								<span>Delivery Fee</span>
								<span className="font-semibold">${deliveryFee.toFixed(2)}</span>
							</div>
							<div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
								<span>Tax (5%)</span>
								<span className="font-semibold">${tax.toFixed(2)}</span>
							</div>
							<div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
							<div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-slate-100">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>

						<Button className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
							Place Order
						</Button>

						<p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
							By placing your order, you agree to our delivery terms and policies.
						</p>
					</aside>
				</section>
			</div>
		</main>
	);
}
