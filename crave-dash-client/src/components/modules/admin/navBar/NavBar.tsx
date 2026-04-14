"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageOpen, Shapes, Users } from "lucide-react";

type NavigationItem = {
    href: string;
    label: string;
    icon: "dashboard" | "users" | "orders" | "categories";
};

export type { NavigationItem };

const iconMap = {
    dashboard: LayoutDashboard,
    users: Users,
    orders: PackageOpen,
    categories: Shapes,
} as const;

export default function NavBar({ navigation }: { navigation: NavigationItem[] }) {
    const pathname = usePathname();
    return (
        <nav className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
            {navigation.map((item) => {
                const Icon = iconMap[item.icon];
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? "border-orange-500 bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20" : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10"}`}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    )
}
