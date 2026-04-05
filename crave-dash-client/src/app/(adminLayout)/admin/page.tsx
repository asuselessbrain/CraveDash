import { BarChart3, DollarSign, Users, Store, Activity } from "lucide-react";

import { adminStats, orderTrend, revenueTrend, adminOrders } from "./data";

const statCards = [
    { label: "Total Users", value: adminStats.totalUsers.toLocaleString(), icon: Users },
    { label: "Total Orders", value: adminStats.totalOrders.toLocaleString(), icon: Activity },
    { label: "Total Providers", value: adminStats.totalProviders.toString(), icon: Store },
    { label: "Total Revenue", value: `$${adminStats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: DollarSign },
];

function ChartBar({ value, max, label }: { value: number; max: number; label: string }) {
    const height = Math.max((value / max) * 160, 12);
    return (
        <div className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 items-end">
                <div className="w-10 rounded-t-2xl bg-gradient-to-t from-orange-500 to-amber-300 shadow-lg shadow-orange-500/20" style={{ height }} title={label} />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        </div>
    );
}

export default function AdminDashboardPage() {
    const maxOrders = Math.max(...orderTrend);
    const maxRevenue = Math.max(...revenueTrend);

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Admin Dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Platform Overview</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Monitor the marketplace, track performance, and review live activity across users, orders, and providers.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article key={card.label} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="flex items-start justify-between gap-3">
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

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Charts</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Simple visual overview of recent performance.</p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-orange-500" />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                            <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">Orders This Week</h3>
                            <div className="mt-6 flex items-end gap-3">
                                {orderTrend.map((value, index) => (
                                    <ChartBar key={index} value={value} max={maxOrders} label={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                            <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">Revenue Trend</h3>
                            <div className="mt-6 flex items-end gap-3">
                                {revenueTrend.map((value, index) => (
                                    <ChartBar key={index} value={value} max={maxRevenue} label={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Recent Activity</h2>
                    <div className="mt-5 space-y-4">
                        {adminOrders.slice(0, 4).map((order) => (
                            <div key={order.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{order.customer}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{order.id} • {order.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </div>
    );
}
