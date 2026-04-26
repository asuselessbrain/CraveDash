import Link from "next/link";
import { ArrowRight, Clock3, Heart, LayoutGrid, ShoppingCart, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { customerDashboardData } from "@/services/dashboard";

function statusStyles(status: string) {
  switch (status.trim().toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
    case "SHIPPED":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
    case "PREPARING":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
    case "PENDING":
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20";
    case "CONFIRMED":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20";
  }
}

function statusLabel(status?: string) {
  switch (status?.trim().toUpperCase()) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "PREPARING":
      return "Preparing";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status ?? "Unknown";
  }
}

type DashboardResponse = {
  success?: boolean;
  message?: string;
  data?: {
    customer?: {
      fullName?: string;
    };
    greeting?: {
      title?: string;
      subtitle?: string;
    };
    sidebar?: {
      label?: string;
      activeCount?: number;
      description?: string;
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
      date?: string;
      dateLabel?: string;
      createdAt?: string;
      status?: string;
      orderStatus?: string;
      statusLabel?: string;
      total?: number;
      amount?: number;
      grandTotal?: number;
      formattedTotal?: string;
      itemsCount?: number;
      itemCount?: number;
      quantity?: number;
      itemCountLabel?: string;
      itemsPreview?: string;
      mealNames?: string[];
      items?: Array<string | { name?: string; title?: string; mealName?: string }>;
    }>;
    quickActions?: Array<{
      href?: string;
      path?: string;
      url?: string;
      label?: string;
      title?: string;
    }>;
    accountTip?: {
      label?: string;
      title?: string;
      description?: string;
    };
  };
};

function getQuickActionIcon(label: string, href: string) {
  const value = `${label} ${href}`.toLowerCase();

  if (value.includes("order") || value.includes("track")) return Truck;
  if (value.includes("meal") || value.includes("food")) return Heart;
  if (value.includes("cart")) return ShoppingCart;

  return LayoutGrid;
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(value?: number) {
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
}

export default async function CustomerDashboardPage() {
  const dashboardDataResponse = (await customerDashboardData()) as DashboardResponse;
  const dashboardData = dashboardDataResponse?.data;

  const customerName = dashboardData?.customer?.fullName ?? "Customer";
  const greetingTitle = dashboardData?.greeting?.title ?? `Welcome back, ${customerName}`;
  const greetingSubtitle =
    dashboardData?.greeting?.subtitle ?? "Track your orders, update your profile, and keep your food journey organized from one place.";

  const sidebarLabel = dashboardData?.sidebar?.label ?? "Today";
  const activeOrders = dashboardData?.sidebar?.activeCount ?? 0;
  const sidebarDescription = dashboardData?.sidebar?.description ?? "Current customer activities";

  const overviewCards = dashboardData?.overviewCards ?? [];
  const recentOrders = dashboardData?.recentOrders ?? [];
  const latestOrders = recentOrders.slice(0, 3);
  const quickActions = dashboardData?.quickActions ?? [];
  const accountTip = dashboardData?.accountTip;

  const rewardCard = overviewCards.find((card) => {
    const identifier = `${card.label ?? ""} ${card.title ?? ""}`.toLowerCase();
    return identifier.includes("reward") || identifier.includes("point");
  });
  const rewardValue = rewardCard?.value ?? rewardCard?.count ?? rewardCard?.total ?? 0;

  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-[2rem] border border-orange-200/70 p-6 text-white shadow-xl shadow-orange-500/20 dark:border-orange-400/20"
        style={{ backgroundImage: "linear-gradient(135deg, #f97316 0%, #f97316 55%, #f59e0b 100%)" }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-orange-50/90">Customer Dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{greetingTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-orange-50/90 sm:text-base">
              {greetingSubtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-xl bg-white text-orange-600 hover:bg-orange-50">
                <Link href="/customer/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/customer/profile">Edit Profile</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-50/80">{sidebarLabel}&apos;s Overview</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-orange-50/70">Active orders</p>
                <p className="mt-1 text-2xl font-black">{activeOrders}</p>
                <p className="mt-1 text-xs text-orange-50/80">{sidebarDescription}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-orange-50/70">Rewards</p>
                <p className="mt-1 text-2xl font-black">{rewardValue}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card, index) => {
          const label = card.label ?? card.title ?? `Overview ${index + 1}`;
          const value = card.value ?? card.count ?? card.total ?? "--";
          const note = card.note ?? card.description ?? "";

          return (
            <article key={`${label}-${index}`} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{note}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Recent Orders</p>
              <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Your latest activity</h2>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/customer/orders">See all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {latestOrders.map((order) => {
              const orderId = order.orderNumber ?? order.id ?? order.orderId ?? "Order";
              const orderStatus = order.orderStatus ?? order.status ?? "";
              const readableStatus = order.statusLabel ?? statusLabel(orderStatus);
              const countNumber = order.itemCount ?? order.itemsCount ?? order.quantity ?? order.items?.length ?? 0;
              const countText = order.itemCountLabel ?? `${countNumber} ${countNumber === 1 ? "item" : "items"}`;
              const itemsText =
                order.itemsPreview ??
                order.mealNames?.join(", ") ??
                order.items
                  ?.map((item) => {
                    if (typeof item === "string") return item;
                    return item.mealName ?? item.name ?? item.title ?? "Item";
                  })
                  .join(", ") ??
                "No item details";
              const amountText = order.formattedTotal ?? `৳${formatAmount(order.total ?? order.amount ?? order.grandTotal)}`;

              return (
                <article key={order.id ?? order.orderId ?? order.orderNumber} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{orderId}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {order.dateLabel ?? formatDate(order.date ?? order.createdAt)} • {countText}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{itemsText}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(orderStatus)}`}>
                        <Clock3 className="h-4 w-4" />
                        {readableStatus}
                      </span>
                      <p className="text-lg font-black text-slate-900 dark:text-slate-100">{amountText}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Quick Actions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {quickActions.map((item, index) => {
                const href = item.href ?? item.path ?? item.url ?? "/";
                const label = item.label ?? item.title ?? "Open";
                const Icon = getQuickActionIcon(label, href);

                return (
                  <Link key={`${href}-${index}`} href={href} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-300">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-orange-500" />
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase dark:text-emerald-300">{accountTip?.label ?? "Account Tip"}</p>
            <h3 className="mt-2 text-lg font-black text-emerald-900 dark:text-emerald-100">{accountTip?.title ?? "Keep your profile updated"}</h3>
            <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/80">
              {accountTip?.description ?? "Your saved address and phone number help speed up every delivery."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
