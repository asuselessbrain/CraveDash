"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminOrders } from "../../data";

type AdminOrderDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    const { id } = use(params);
    const order = adminOrders.find((item) => item.id.toLowerCase() === id);

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{order.id}</h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950"><CalendarDays className="h-4 w-4 text-orange-500" />{order.date}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950"><BadgeCheck className="h-4 w-4 text-orange-500" />{order.status}</span>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
                        <p className="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><MapPin className="mt-0.5 h-4 w-4 text-orange-500" />{order.address}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
                        <div className="mt-4 space-y-3">
                            {order.items.map((item) => (
                                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Included in this order</p>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">Item</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Total Amount</h2>
                        <p className="mt-2 text-3xl font-black text-orange-600 dark:text-orange-300">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Quick Info</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Items count: {order.itemsCount}</p>
                    </div>
                    <Button className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                        Update Order Status
                    </Button>
                    <Button variant="outline" className="h-11 w-full rounded-xl">
                        Print Receipt
                    </Button>
                </aside>
            </section>
        </div>
    );
}
