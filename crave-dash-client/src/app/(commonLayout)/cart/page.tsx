"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type CartItem = {
	id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
	provider: string;
};

const initialCartItems: CartItem[] = [
	{
		id: "1",
		name: "Margherita Pizza",
		image: "/categories/pizza.svg",
		price: 8.99,
		quantity: 1,
		provider: "Pizza Palace",
	},
	{
		id: "9",
		name: "Chocolate Lava Cake",
		image: "/categories/desserts.svg",
		price: 5.99,
		quantity: 2,
		provider: "Sweet Room",
	},
	{
		id: "11",
		name: "Mango Smoothie",
		image: "/categories/drinks.svg",
		price: 4.49,
		quantity: 1,
		provider: "Juice Point",
	},
];

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

	const subtotal = useMemo(() => {
		return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}, [cartItems]);

	const deliveryFee = cartItems.length > 0 ? 1.5 : 0;
	const tax = subtotal * 0.05;
	const total = subtotal + deliveryFee + tax;

	const updateQuantity = (id: string, direction: "inc" | "dec") => {
		setCartItems((prev) =>
			prev
				.map((item) => {
					if (item.id !== id) return item;
					const nextQuantity = direction === "inc" ? item.quantity + 1 : item.quantity - 1;
					return { ...item, quantity: nextQuantity };
				})
				.filter((item) => item.quantity > 0)
		);
	};

	const removeItem = (id: string) => {
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	};

	const clearCart = () => {
		setCartItems([]);
	};

	if (cartItems.length === 0) {
		return (
			<main className="food-landing-bg">
				<div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
					<div className="w-full rounded-3xl border border-orange-200/70 bg-white/90 p-8 text-center shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-12">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
							<ShoppingBag className="h-8 w-8" />
						</div>
						<h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Your cart is empty</h1>
						<p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
							Looks like you have not added any meals yet. Explore delicious options and build your order.
						</p>
						<Button asChild className="mt-6 h-11 rounded-xl bg-orange-500 px-6 text-white hover:bg-orange-400">
							<Link href="/meals">Browse Meals</Link>
						</Button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="food-landing-bg">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<header className="mb-6">
					<p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Shopping Cart</p>
					<h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Review Your Order</h1>
				</header>

				<section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
					<div className="rounded-3xl border border-orange-200/70 bg-white/85 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Cart Items ({cartItems.length})</h2>
							<button
								type="button"
								onClick={clearCart}
								className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-300"
							>
								Clear cart
							</button>
						</div>

						<div className="space-y-4">
							{cartItems.map((item) => (
								<article
									key={item.id}
									className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between"
								>
									<div className="flex items-center gap-3">
										<div className="relative h-18 w-18 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
											<Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" />
										</div>
										<div>
											<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
											<p className="text-sm text-slate-500 dark:text-slate-400">{item.provider}</p>
											<p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-300">${item.price.toFixed(2)}</p>
										</div>
									</div>

									<div className="flex items-center justify-between gap-3 sm:justify-end">
										<div className="inline-flex items-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
											<button
												type="button"
												onClick={() => updateQuantity(item.id, "dec")}
												className="px-3 py-1.5 text-slate-700 dark:text-slate-200"
												aria-label={`Decrease quantity of ${item.name}`}
											>
												<Minus className="h-4 w-4" />
											</button>
											<span className="px-2 text-sm font-bold text-slate-900 dark:text-slate-100">{item.quantity}</span>
											<button
												type="button"
												onClick={() => updateQuantity(item.id, "inc")}
												className="px-3 py-1.5 text-slate-700 dark:text-slate-200"
												aria-label={`Increase quantity of ${item.name}`}
											>
												<Plus className="h-4 w-4" />
											</button>
										</div>

										<button
											type="button"
											onClick={() => removeItem(item.id)}
											className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500/40 dark:hover:text-rose-300"
											aria-label={`Remove ${item.name}`}
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</article>
							))}
						</div>
					</div>

					<aside className="h-fit rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
						<h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>

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
							Proceed to Checkout
						</Button>

						<Button asChild variant="outline" className="mt-3 h-11 w-full rounded-xl">
							<Link href="/meals">Add More Meals</Link>
						</Button>
					</aside>
				</section>
			</div>
		</main>
	);
}
