"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderStatusOptions, providerOrders, type ProviderOrderStatus } from "../data";

export default function ProviderOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<"All" | ProviderOrderStatus>("All");
    const [orders, setOrders] = useState(providerOrders);
    const [search, setSearch] = useState("");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchStatus = statusFilter === "All" || order.status === statusFilter;
            const matchSearch = order.id.toLowerCase().includes(search.toLowerCase()) || order.customer.toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [orders, search, statusFilter]);

    const updateStatus = (orderId: string, status: ProviderOrderStatus) => {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Orders</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Order Management</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track order flow, update status, and inspect customer details.</p>
                </div>

                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders or customers" className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950" />
                </div>
            </header>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-wrap gap-2">
                    {orderStatusOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${statusFilter === status ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.items}</td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(event) => updateStatus(order.id, event.target.value as ProviderOrderStatus)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                        >
                                            {(["Placed", "Preparing", "Ready", "Delivered", "Cancelled"] as ProviderOrderStatus[]).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-4 py-4">
                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                            <Link href={`/provider/orders/${order.id.toLowerCase()}`}>View Details <ChevronRight className="h-4 w-4" /></Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No orders found for this filter.
                    </div>
                )}
            </section>
        </div>
    );
}
