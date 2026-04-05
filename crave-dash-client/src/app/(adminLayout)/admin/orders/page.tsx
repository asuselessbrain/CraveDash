"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminOrders, type AdminOrderStatus } from "../data";

const statuses: Array<"All" | AdminOrderStatus> = ["All", "Placed", "Preparing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
    const [status, setStatus] = useState<"All" | AdminOrderStatus>("All");
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");

    const filteredOrders = useMemo(() => {
        return adminOrders.filter((order) => {
            const matchesStatus = status === "All" || order.status === status;
            const matchesCustomer = order.customer.toLowerCase().includes(customer.toLowerCase());
            const matchesDate = !date || order.date.toLowerCase().includes(date.toLowerCase());
            return matchesStatus && matchesCustomer && matchesDate;
        });
    }, [customer, date, status]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Orders</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">All Orders</h1>
                </div>

                <div className="grid gap-3 md:grid-cols-3 md:items-center">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Customer" className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950" />
                    </div>
                    <Input value={date} onChange={(event) => setDate(event.target.value)} placeholder="Date" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950">
                        <CalendarDays className="ml-2 h-4 w-4 text-slate-400" />
                        <span className="pr-3 text-sm text-slate-500 dark:text-slate-400">Filter by date</span>
                    </div>
                </div>
            </header>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-wrap gap-2">
                    {statuses.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setStatus(item)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${status === item ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                        >
                            {item}
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
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.itemsCount}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.status}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-4 py-4">
                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                            <Link href={`/admin/orders/${order.id.toLowerCase()}`}>View Details</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No orders matched your filters.
                    </div>
                )}
            </section>
        </div>
    );
}
