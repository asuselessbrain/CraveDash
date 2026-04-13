import {
    BarChart3,
    Clock3,
    DollarSign,
    ShoppingBag,
    ShieldAlert,
    Users,
    UtensilsCrossed,
} from "lucide-react";

import { adminDashboardData } from "@/services/dashboard";

type DashboardCard = {
    label?: string;
    title?: string;
    value?: number | string;
    icon?: string;
};

type ChartPoint = {
    label?: string;
    value?: number | string;
};

type DashboardResponse = {
    success?: boolean;
    message?: string;
    data?: {
        greeting?: {
            title?: string;
            subtitle?: string;
        };
        sidebar?: {
            label?: string;
            status?: string;
            description?: string;
        };
        metrics?: {
            totalCustomers?: number;
            suspendedUsers?: number;
            pendingOrders?: number;
            unavailableMeals?: number;
        };
        overviewCards?: DashboardCard[];
        charts?: {
            weeklyOrders?: Array<number | ChartPoint>;
            weeklyRevenue?: Array<number | ChartPoint>;
        };
        quickActions?: unknown[];
        recentActivity?: unknown[];
        recentUsers?: unknown[];
    };
};

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const iconMap = {
    users: Users,
    user: Users,
    orders: ShoppingBag,
    order: ShoppingBag,
    revenue: DollarSign,
    money: DollarSign,
    meals: UtensilsCrossed,
    pending: Clock3,
    suspended: ShieldAlert,
} as const;

function getIcon(icon?: string) {
    const key = (icon || "").toLowerCase() as keyof typeof iconMap;
    return iconMap[key] ?? Users;
}

function formatMetricValue(value: unknown): string {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return asNumber.toLocaleString();
    return String(value ?? "0");
}

function normalizeChartSeries(points: Array<number | ChartPoint> | undefined): Array<{ label: string; value: number }> {
    const normalized = (points ?? []).map((point, index) => {
        if (typeof point === "number") {
            return {
                label: weekLabels[index] ?? `Day ${index + 1}`,
                value: Number.isFinite(point) ? point : 0,
            };
        }

        const parsedValue = Number(point?.value);
        return {
            label: point?.label ?? weekLabels[index] ?? `Day ${index + 1}`,
            value: Number.isFinite(parsedValue) ? parsedValue : 0,
        };
    });

    if (normalized.length) {
        return normalized;
    }

    return weekLabels.map((label) => ({ label, value: 0 }));
}

function ChartBar({ value, max, label }: { value: number; max: number; label: string }) {
    const safeMax = max > 0 ? max : 1;
    const height = Math.max((value / safeMax) * 160, 12);

    return (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-40 items-end">
                <div className="w-7 rounded-t-xl bg-linear-to-t from-orange-500 to-amber-300 shadow-lg shadow-orange-500/20 sm:w-8 md:w-9 lg:w-10" style={{ height }} title={label} />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        </div>
    );
}

export default async function AdminDashboardPage() {
    const response = (await adminDashboardData()) as DashboardResponse;
    const data = response?.data;

    const greetingTitle = data?.greeting?.title ?? "Platform Overview";
    const greetingSubtitle = data?.greeting?.subtitle ?? "Monitor the marketplace, track performance, and review live activity across users, orders, and providers.";

    const fallbackCards: DashboardCard[] = [
        { label: "Total Customers", value: data?.metrics?.totalCustomers ?? 0, icon: "users" },
        { label: "Suspended Users", value: data?.metrics?.suspendedUsers ?? 0, icon: "suspended" },
        { label: "Pending Orders", value: data?.metrics?.pendingOrders ?? 0, icon: "pending" },
        { label: "Unavailable Meals", value: data?.metrics?.unavailableMeals ?? 0, icon: "meals" },
    ];

    const overviewCards = (data?.overviewCards?.length ? data.overviewCards : fallbackCards).slice(0, 4);

    const weeklyOrders = normalizeChartSeries(data?.charts?.weeklyOrders);
    const weeklyRevenue = normalizeChartSeries(data?.charts?.weeklyRevenue);
    const maxOrders = Math.max(1, ...weeklyOrders.map((point) => point.value));
    const maxRevenue = Math.max(1, ...weeklyRevenue.map((point) => point.value));

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Admin Dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{greetingTitle}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{greetingSubtitle}</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card, index) => {
                    const Icon = getIcon(card.icon);
                    const label = card.label ?? card.title ?? `Metric ${index + 1}`;
                    const value = formatMetricValue(card.value);

                    return (
                        <article key={`${label}-${index}`} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="flex items-start justify-between gap-3">
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

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
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
                            <div className="mt-6 flex items-end gap-2 sm:gap-3 md:gap-4">
                                {weeklyOrders.map((point, index) => (
                                    <ChartBar key={`orders-${index}`} value={point.value} max={maxOrders} label={point.label} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                            <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">Revenue Trend</h3>
                            <div className="mt-6 flex items-end gap-2 sm:gap-3 md:gap-4">
                                {weeklyRevenue.map((point, index) => (
                                    <ChartBar key={`revenue-${index}`} value={point.value} max={maxRevenue} label={point.label} />
                                ))}
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}
