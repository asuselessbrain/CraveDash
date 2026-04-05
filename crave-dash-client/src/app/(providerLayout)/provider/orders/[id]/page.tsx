"use client";

import Image from "next/image";
import { use } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, CircleDot, Clock3, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { providerOrderDetailMap } from "../../data";

type ProviderOrderDetailsPageProps = {
    params: Promise<{ id: string }>;
};

const statusSteps = [
    { label: "Placed", icon: CircleDot },
    { label: "Preparing", icon: Clock3 },
    { label: "Ready", icon: Truck },
    { label: "Delivered", icon: BadgeCheck },
];

function statusStyles(status: string) {
    switch (status) {
        case "Delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
        case "Ready":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
        case "Preparing":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
        case "Cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20";
    }
}

export default function ProviderOrderDetailsPage({ params }: ProviderOrderDetailsPageProps) {
    const { id } = use(params);
    const order = providerOrderDetailMap[id.toLowerCase()];

    if (!order) {
        notFound();
    }

    const total = order.itemsList.reduce((sum, item) => sum + item.price * item.qty, 0);
    const activeIndex = order.status === "Cancelled" ? -1 : statusSteps.findIndex((step) => step.label === order.status);

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{order.id}</h1>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950">
                                <CalendarDays className="h-4 w-4 text-orange-500" /> {order.date}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold ${statusStyles(order.status)}`}>
                                <BadgeCheck className="h-4 w-4" /> {order.status}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Customer address for this order.</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{order.address}</p>
                    </div>

                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
                        <div className="mt-5 space-y-4">
                            {order.itemsList.map((item) => (
                                <article key={item.name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                            <Image src="/categories/pizza.svg" alt={item.name} fill sizes="64px" className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.qty}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">${(item.price * item.qty).toFixed(2)}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Total Amount</h2>
                        <p className="mt-3 text-3xl font-black text-orange-600 dark:text-orange-300">${total.toFixed(2)}</p>
                    </div>

                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Status Tracker</h2>
                        <div className="mt-5 space-y-4">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                const active = index <= activeIndex;
                                return (
                                    <div key={step.label} className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${active ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`font-semibold ${active ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{step.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {order.status === "Delivered" && (
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
                            <h2 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">Order delivered</h2>
                            <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">Leave a review after the order is completed.</p>
                            <Button className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Leave Review</Button>
                        </div>
                    )}
                </aside>
            </section>
        </div>
    );
}
