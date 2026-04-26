import Link from "next/link";
import { ArrowRight, ShoppingCart, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { providerDashboardData } from "@/services/dashboard";

type DashboardResponse = {
  success?: boolean;
  message?: string;
  data?: {
    provider?: {
      email?: string;
      role?: string;
      createdAt?: string;
    };
    greeting?: {
      title?: string;
      subtitle?: string;
    };
    sidebar?: {
      label?: string;
      performanceScore?: number;
      scoreDescription?: string;
    };
    overviewCards?: Array<{
      label?: string;
      title?: string;
      value?: string | number;
      count?: string | number;
      total?: string | number;
      note?: string;
      description?: string;
    }>;
    recentOrders?: Array<{
      id?: string;
      orderId?: string;
      orderNumber?: string;
      customerName?: string;
      customerEmail?: string;
      itemCount?: number;
      quantity?: number;
      itemCountLabel?: string;
      status?: string;
      orderStatus?: string;
      statusLabel?: string;
      total?: number | string;
      amount?: number | string;
      grandTotal?: number | string;
      formattedTotal?: string;
    }>;
    quickActions?: Array<{
      href?: string;
      path?: string;
      url?: string;
      label?: string;
      title?: string;
    }>;
  };
};

function formatAmount(value?: number | string): string {
  if (typeof value === "string") return value;
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
}

export default async function ProviderDashboardPage() {
    const providerDashboardResponse = (await providerDashboardData()) as DashboardResponse;
    const dashboardData = providerDashboardResponse?.data;

    const greetingTitle = dashboardData?.greeting?.title ?? "Business Overview";
    const greetingSubtitle =
      dashboardData?.greeting?.subtitle ?? "Monitor performance, review recent activity, and jump straight into operational tasks.";

    const performanceScore = dashboardData?.sidebar?.performanceScore ?? 0;
    const scoreDescription = dashboardData?.sidebar?.scoreDescription ?? "Provider performance score";

    const overviewCards = dashboardData?.overviewCards ?? [];
    const recentOrders = dashboardData?.recentOrders ?? [];
    const quickActions = dashboardData?.quickActions ?? [];

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Dashboard</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{greetingTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{greetingSubtitle}</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card, index) => {
                    const label = card.label ?? card.title ?? `Stat ${index + 1}`;
                    const value = card.value ?? card.count ?? card.total ?? "--";
                    const Icon = ShoppingCart;

                    return (
                        <article key={`${label}-${index}`} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{label}</p>
                                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
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

                    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
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
                                {recentOrders.map((order) => {
                                    const orderId = order.orderNumber ?? order.orderId ?? order.id ?? "Order";
                                    const customerName = order.customerName ?? "Unknown";
                                    const itemCount = order.itemCount ?? order.quantity ?? 0;
                                    const itemCountLabel = order.itemCountLabel ?? `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
                                    const status = order.statusLabel ?? order.orderStatus ?? order.status ?? "Pending";
                                    const totalAmount = order.formattedTotal ?? `৳${formatAmount(order.total ?? order.amount ?? order.grandTotal)}`;

                                    return (
                                        <tr key={order.id ?? order.orderId ?? orderId} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                            <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{orderId}</td>
                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{customerName}</td>
                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{itemCountLabel}</td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">{status}</span>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{totalAmount}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {recentOrders.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                            No recent orders found.
                        </div>
                    )}
                </div>

                <aside className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{scoreDescription}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{performanceScore}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Quick Actions</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Common tasks for daily operation.</p>
                    </div>

                    <div className="space-y-3">
                        {quickActions.map((action, index) => {
                            const href = action.href ?? action.path ?? action.url ?? "#";
                            const label = action.label ?? action.title ?? "Action";
                            const isPrimary = index === 0;

                            return (
                                <Button
                                    key={`${href}-${index}`}
                                    asChild
                                    className={`h-11 w-full rounded-xl ${isPrimary ? "bg-orange-500 text-white hover:bg-orange-400" : ""}`}
                                    variant={isPrimary ? "default" : "outline"}
                                >
                                    <Link href={href}>
                                        {label} <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </aside>
            </section>
        </div>
    );
}
