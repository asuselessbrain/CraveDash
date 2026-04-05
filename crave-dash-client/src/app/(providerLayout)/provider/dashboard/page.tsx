import Link from "next/link";
import { ArrowRight, Banknote, CalendarClock, ChefHat, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { providerStats, recentProviderOrders } from "../data";

const statCards = [
    { label: "Total Orders", value: providerStats.totalOrders.toLocaleString(), icon: ShoppingCart },
    { label: "Today's Orders", value: providerStats.todayOrders.toString(), icon: CalendarClock },
    { label: "Total Revenue", value: `$${providerStats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: Banknote },
    { label: "Active Meals", value: providerStats.activeMeals.toString(), icon: ChefHat },
];

export default function ProviderDashboardPage() {
    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Dashboard</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Business Overview</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Monitor performance, review recent activity, and jump straight into operational tasks.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article key={card.label} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{card.label}</p>
                                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{card.value}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Recent Orders</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Most recent incoming and completed orders.</p>
                        </div>
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/provider/orders">View All</Link>
                        </Button>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-950">
                                <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                                {recentProviderOrders.map((order) => (
                                    <tr key={order.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                        <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.itemsCount}</td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">{order.status}</span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <aside className="space-y-4 rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Quick Actions</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Common tasks for daily operation.</p>
                    </div>

                    <div className="space-y-3">
                        <Button asChild className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Link href="/provider/menu">Manage Menu <ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                            <Link href="/provider/orders">Review Orders <ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                            <Link href="/provider/menu?create=1">Add New Meal <ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                    </div>
                </aside>
            </section>
        </div>
    );
}
