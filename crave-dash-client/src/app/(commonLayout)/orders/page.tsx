"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Clock3, PackageCheck, Search, Truck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderStatus = "Delivered" | "On the way" | "Preparing" | "Cancelled";

type Order = {
    id: string;
    date: string;
    status: OrderStatus;
    total: number;
    itemsCount: number;
    items: string[];
};

const orders: Order[] = [
    {
        id: "ORD-240401",
        date: "Apr 1, 2026",
        status: "Delivered",
        total: 24.46,
        itemsCount: 3,
        items: ["Margherita Pizza", "Chocolate Lava Cake", "Mango Smoothie"],
    },
    {
        id: "ORD-240402",
        date: "Apr 2, 2026",
        status: "On the way",
        total: 18.48,
        itemsCount: 2,
        items: ["Classic Beef Burger", "Cold Coffee"],
    },
    {
        id: "ORD-240403",
        date: "Apr 3, 2026",
        status: "Preparing",
        total: 31.97,
        itemsCount: 4,
        items: ["Kacchi Biryani", "Chicken Biryani", "Mango Smoothie", "Lava Cake"],
    },
    {
        id: "ORD-240390",
        date: "Mar 30, 2026",
        status: "Cancelled",
        total: 11.99,
        itemsCount: 1,
        items: ["Smoked BBQ Wings"],
    },
];

const statusOptions: Array<"All" | OrderStatus> = ["All", "Delivered", "On the way", "Preparing", "Cancelled"];

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

function statusIcon(status: OrderStatus) {
    switch (status) {
        case "Delivered":
            return <PackageCheck className="h-4 w-4" />;
        case "On the way":
            return <Truck className="h-4 w-4" />;
        case "Preparing":
            return <Clock3 className="h-4 w-4" />;
        case "Cancelled":
            return <XCircle className="h-4 w-4" />;
    }
}

export default function OrdersPage() {
    const [selectedStatus, setSelectedStatus] = useState<"All" | OrderStatus>("All");
    const [search, setSearch] = useState("");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
            const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || order.items.some((item) => item.toLowerCase().includes(search.toLowerCase()));
            return matchesStatus && matchesSearch;
        });
    }, [selectedStatus, search]);

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">My Orders</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Order History</h1>
                </header>

                <section className="rounded-3xl border border-orange-200/70 bg-white/85 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-xl">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by order ID or item name"
                                className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setSelectedStatus(status)}
                                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${selectedStatus === status ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 lg:block">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-950">
                                <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    <th className="px-5 py-4">Order ID</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Total</th>
                                    <th className="px-5 py-4">Items</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                                                {statusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.itemsCount}</td>
                                        <td className="px-5 py-4 text-right">
                                            <Button asChild variant="outline" className="rounded-xl">
                                                <Link href={`/orders/${order.id.toLowerCase()}`}>View Details <ChevronRight className="h-4 w-4" /></Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 space-y-4 lg:hidden">
                        {filteredOrders.map((order) => (
                            <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{order.id}</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.date}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                                        {statusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                                        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Total</p>
                                        <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                                        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Items</p>
                                        <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">{order.itemsCount}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                                        {order.items.join(", ")}
                                    </p>
                                    <Button asChild variant="outline" className="rounded-xl">
                                        <Link href={`/orders/${order.id.toLowerCase()}`}>View Details</Link>
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            No orders matched this filter.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
