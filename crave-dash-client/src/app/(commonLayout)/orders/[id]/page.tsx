"use client";

import Image from "next/image";
import { use } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, CheckCircle2, CircleDot, Clock3, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

type OrderStatus = "Delivered" | "On the way" | "Preparing" | "Cancelled";

type OrderItem = {
    name: string;
    image: string;
    price: number;
    quantity: number;
};

type OrderDetails = {
    id: string;
    date: string;
    status: OrderStatus;
    address: string;
    total: number;
    items: OrderItem[];
};

const orders: Record<string, OrderDetails> = {
    "ord-240401": {
        id: "ORD-240401",
        date: "Apr 1, 2026",
        status: "Delivered",
        address: "House 21, Road 12, Dhanmondi, Dhaka",
        total: 24.46,
        items: [
            { name: "Margherita Pizza", image: "/categories/pizza.svg", price: 8.99, quantity: 1 },
            { name: "Chocolate Lava Cake", image: "/categories/desserts.svg", price: 5.99, quantity: 2 },
            { name: "Mango Smoothie", image: "/categories/drinks.svg", price: 4.49, quantity: 1 },
        ],
    },
    "ord-240402": {
        id: "ORD-240402",
        date: "Apr 2, 2026",
        status: "On the way",
        address: "House 8, Road 3, Banani, Dhaka",
        total: 18.48,
        items: [
            { name: "Classic Beef Burger", image: "/categories/burger.svg", price: 7.99, quantity: 1 },
            { name: "Cold Coffee", image: "/categories/drinks.svg", price: 3.99, quantity: 2 },
        ],
    },
    "ord-240403": {
        id: "ORD-240403",
        date: "Apr 3, 2026",
        status: "Preparing",
        address: "Sector 7, Uttara, Dhaka",
        total: 31.97,
        items: [
            { name: "Kacchi Biryani", image: "/categories/biryani.svg", price: 9.99, quantity: 2 },
            { name: "Lava Cake", image: "/categories/desserts.svg", price: 5.99, quantity: 1 },
            { name: "Mango Smoothie", image: "/categories/drinks.svg", price: 4.49, quantity: 1 },
        ],
    },
    "ord-240390": {
        id: "ORD-240390",
        date: "Mar 30, 2026",
        status: "Cancelled",
        address: "Mohammadpur, Dhaka",
        total: 11.99,
        items: [{ name: "Smoked BBQ Wings", image: "/categories/bbq.svg", price: 11.99, quantity: 1 }],
    },
};

const timeline = [
    { label: "Order Placed", icon: CircleDot },
    { label: "Preparing", icon: Clock3 },
    { label: "On the Way", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
];

type OrderDetailsPageProps = {
    params: Promise<{ id: string }>;
};

function statusStyles(status: OrderStatus) {
    switch (status) {
        case "Delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
        case "On the way":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
        case "Preparing":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
        case "Cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
    }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = use(params);
    const order = orders[id.toLowerCase()];

    if (!order) {
        notFound();
    }

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 1.5;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{order.id}</h1>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                        <BadgeCheck className="h-4 w-4" />
                        {order.status}
                    </span>
                </header>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Order Date</p>
                                    <p className="mt-2 inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100"><CalendarDays className="h-4 w-4 text-orange-500" />{order.date}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Delivery Address</p>
                                    <p className="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><MapPin className="mt-0.5 h-4 w-4 flex-none text-orange-500" />{order.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
                            <div className="mt-5 space-y-4">
                                {order.items.map((item) => (
                                    <article key={item.name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">${(item.price * item.quantity).toFixed(2)}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>
                            <div className="mt-4 space-y-3 text-sm">
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
                        </div>

                        <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Status Tracker</h2>
                            <div className="mt-5 space-y-4">
                                {timeline.map((step, index) => {
                                    const Icon = step.icon;
                                    const activeIndex = order.status === "Cancelled" ? 0 : order.status === "Preparing" ? 1 : order.status === "On the way" ? 2 : 3;
                                    const isActive = index <= activeIndex;
                                    return (
                                        <div key={step.label} className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${isActive ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{step.label}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {order.status === "Delivered" && (
                            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
                                <h2 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">Your order has been delivered</h2>
                                <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">Leave a review to help others and share your experience.</p>
                                <Button className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                                    Leave Review
                                </Button>
                            </div>
                        )}
                    </aside>
                </section>
            </div>
        </main>
    );
}
