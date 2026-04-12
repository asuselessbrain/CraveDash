import Link from "next/link";
import { ArrowRight, Clock3, Heart, LayoutGrid, ShoppingCart, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { customerOrders, customerStats, type CustomerOrderStatus } from "./data";

function statusStyles(status: CustomerOrderStatus) {
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

export default function CustomerDashboardPage() {
  const activeOrders = customerOrders.filter((order) => order.status !== "Delivered").length;
  const latestOrders = customerOrders.slice(0, 3);

  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-[2rem] border border-orange-200/70 p-6 text-white shadow-xl shadow-orange-500/20 dark:border-orange-400/20"
        style={{ backgroundImage: "linear-gradient(135deg, #f97316 0%, #f97316 55%, #f59e0b 100%)" }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-orange-50/90">Customer Dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome back, Arfan</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-orange-50/90 sm:text-base">
              Track your orders, update your profile, and keep your food journey organized from one place.
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
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-50/80">Today&apos;s Overview</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-orange-50/70">Active orders</p>
                <p className="mt-1 text-2xl font-black">{activeOrders}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-orange-50/70">Rewards</p>
                <p className="mt-1 text-2xl font-black">240</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerStats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.note}</p>
          </article>
        ))}
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
            {latestOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.id}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.date} • {order.itemsCount} items</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{order.items.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                      <Clock3 className="h-4 w-4" />
                      {order.status}
                    </span>
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Quick Actions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { href: "/customer/profile", label: "Manage profile", icon: LayoutGrid },
                { href: "/customer/orders", label: "Track orders", icon: Truck },
                { href: "/meals", label: "Browse meals", icon: Heart },
                { href: "/cart", label: "Open cart", icon: ShoppingCart },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-300">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-orange-500" />
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase dark:text-emerald-300">Account Tip</p>
            <h3 className="mt-2 text-lg font-black text-emerald-900 dark:text-emerald-100">Keep your profile updated</h3>
            <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/80">
              Your saved address and phone number help speed up every delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
