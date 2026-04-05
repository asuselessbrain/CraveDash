"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListOrdered, LogOut, Menu, Package2, Layers, UtensilsCrossed } from "lucide-react";

const navigation = [
    { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/menu", label: "Manage Menu", icon: Menu },
    { href: "/provider/categories", label: "Categories", icon: Layers },
    { href: "/provider/cuisines", label: "Cuisines", icon: UtensilsCrossed },
    { href: "/provider/orders", label: "Provider Orders", icon: ListOrdered },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col lg:flex-row">
                <aside className="flex flex-col border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
                    <div className="flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-orange-50 px-4 py-3 dark:border-orange-400/20 dark:bg-orange-500/10">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <Package2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Panel</p>
                            <h1 className="text-base font-black tracking-tight">CraveDash Admin</h1>
                        </div>
                    </div>

                    <nav className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10"}`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Today</p>
                        <p className="mt-2 text-2xl font-black">4.8/5</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Provider performance score</p>
                    </div>

                    <div className="mt-6 pt-2 lg:mt-auto">
                        <Link
                            href="/sign-in"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Link>
                    </div>
                </aside>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
