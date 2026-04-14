import {
    Building2,
    Clock3,
    DollarSign,
    ShoppingBag,
    ShieldAlert,
    Users,
    UtensilsCrossed,
} from "lucide-react";

import AdminChartsPanel from "@/components/modules/admin/dashboard/AdminChartsPanel";
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

type QuickActionItem = {
    label?: string;
    href?: string;
};

type RecentOrderItem = {
    id?: string;
    orderNumber?: string;
    customerName?: string;
    formattedTotal?: string;
    statusLabel?: string;
    dateLabel?: string;
};

type RecentUserItem = {
    label?: string;
    description?: string;
};

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const iconMap = {
    users: Users,
    user: Users,
    customers: Users,
    orders: ShoppingBag,
    order: ShoppingBag,
    totalorders: ShoppingBag,
    revenue: DollarSign,
    totalrevenue: DollarSign,
    money: DollarSign,
    meals: UtensilsCrossed,
    pending: Clock3,
    suspended: ShieldAlert,
    providers: Building2,
    totalproviders: Building2,
    totalusers: Users,
} as const;

function getIcon(card: DashboardCard) {
    const raw = (card.icon || card.label || card.title || "").toLowerCase().replace(/\s+/g, "");
    const direct = iconMap[raw as keyof typeof iconMap];
    if (direct) return direct;

    if (raw.includes("provider")) return Building2;
    if (raw.includes("revenue") || raw.includes("money")) return DollarSign;
    if (raw.includes("order")) return ShoppingBag;
    if (raw.includes("meal")) return UtensilsCrossed;
    if (raw.includes("pending")) return Clock3;
    if (raw.includes("suspend") || raw.includes("block")) return ShieldAlert;

    return Users;
}

function getCardAccent(label: string) {
    const key = label.toLowerCase();
    if (key.includes("revenue")) return "from-emerald-500/15 to-teal-500/5 text-emerald-600 dark:text-emerald-300";
    if (key.includes("order")) return "from-orange-500/15 to-amber-500/5 text-orange-600 dark:text-orange-300";
    if (key.includes("provider")) return "from-sky-500/15 to-cyan-500/5 text-sky-600 dark:text-sky-300";
    return "from-violet-500/15 to-fuchsia-500/5 text-violet-600 dark:text-violet-300";
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

    const quickActions = (Array.isArray(data?.quickActions) ? data.quickActions : []) as QuickActionItem[];
    const recentOrders = (Array.isArray(data?.recentActivity) ? data.recentActivity : []) as RecentOrderItem[];
    const recentUsers = (Array.isArray(data?.recentUsers) ? data.recentUsers : []) as RecentUserItem[];

    const systemStatusLabel = data?.sidebar?.label ?? "System";
    const systemStatusValue = data?.sidebar?.status ?? "Unknown";
    const systemStatusDescription = data?.sidebar?.description ?? "Status information unavailable";

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-linear-to-br from-white via-white to-orange-50/50 p-5 shadow-sm dark:border-orange-400/20 dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-950 sm:p-6">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Admin Dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{greetingTitle}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{greetingSubtitle}</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card, index) => {
                    const Icon = getIcon(card);
                    const label = card.label ?? card.title ?? `Metric ${index + 1}`;
                    const value = formatMetricValue(card.value);
                    const accentClass = getCardAccent(label);

                    return (
                        <article key={`${label}-${index}`} className="group rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{label}</p>
                                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${accentClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            <AdminChartsPanel weeklyOrders={weeklyOrders} weeklyRevenue={weeklyRevenue} />

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Recent Orders</h2>
                        <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Dynamic Feed
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {recentOrders.length ? (
                            recentOrders.slice(0, 4).map((order, index) => (
                                <article
                                    key={order.id ?? `${order.orderNumber}-${index}`}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-orange-500/40"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                {order.orderNumber ?? "Order"}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {order.customerName ?? "Customer"} • {order.dateLabel ?? "N/A"}
                                            </p>
                                        </div>
                                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-300">
                                            {order.formattedTotal ?? "$0"}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-300">
                                        {order.statusLabel ?? "Status N/A"}
                                    </p>
                                </article>
                            ))
                        ) : (
                            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
                                No recent orders available.
                            </p>
                        )}
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            {systemStatusLabel}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">{systemStatusValue}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{systemStatusDescription}</p>

                        <div className="mt-4 grid gap-2">
                            {quickActions.length ? (
                                quickActions.slice(0, 3).map((action, index) => (
                                    <a
                                        key={`${action.label}-${index}`}
                                        href={action.href ?? "#"}
                                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-orange-400"
                                    >
                                        {action.label ?? "Action"}
                                    </a>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No quick actions available.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Newest Users</h3>
                        <div className="mt-4 space-y-3">
                            {recentUsers.length ? (
                                recentUsers.slice(0, 4).map((user, index) => (
                                    <article
                                        key={`${user.label}-${index}`}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60"
                                    >
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.label ?? "User"}</p>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user.description ?? "No details"}</p>
                                    </article>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No recent user activity.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}
