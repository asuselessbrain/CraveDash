import { BadgePercent } from "lucide-react";
import Logout from "@/components/modules/shared/Logout";
import NavBar, { type NavigationItem } from "@/components/modules/admin/navBar/NavBar";
import Link from "next/link";

const navigation = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/users", label: "Manage Users", icon: "users" },
    { href: "/admin/orders", label: "Manage Orders", icon: "orders" },
    { href: "/admin/categories", label: "Manage Categories", icon: "categories" },
] satisfies NavigationItem[];

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50/40 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col lg:pl-72">
                <aside className="flex flex-col border-b border-slate-200/90 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 lg:fixed lg:inset-y-0 lg:left-[max(0px,calc((100vw-1536px)/2))] lg:z-30 lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
                    <Link href="/">
                        <div className="flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-orange-50 px-4 py-3 dark:border-orange-400/20 dark:bg-orange-500/10">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                                <BadgePercent className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Admin Panel</p>
                                <h1 className="text-base font-black tracking-tight">CraveDash Control</h1>
                            </div>
                        </div>
                    </Link>

                    <NavBar navigation={navigation} />

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-emerald-50/40 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">System Status</p>
                        <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">Healthy</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All services operational</p>
                    </div>

                    <div className="mt-6 pt-2 lg:mt-auto">
                        <Logout />
                    </div>
                </aside>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
