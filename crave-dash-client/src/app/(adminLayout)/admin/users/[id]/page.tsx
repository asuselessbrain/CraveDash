"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminUsers } from "../../data";

type AdminUserDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
    const { id } = use(params);
    const user = adminUsers.find((item) => item.id === id);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">User Details</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{user.name}</h1>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Email</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><Mail className="h-4 w-4 text-orange-500" />{user.email}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Phone</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><Phone className="h-4 w-4 text-orange-500" />{user.phone}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Role</p>
                            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user.role}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Join Date</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><CalendarDays className="h-4 w-4 text-orange-500" />{user.joinDate}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Address</p>
                            <p className="mt-2 inline-flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-100"><MapPin className="mt-0.5 h-4 w-4 text-orange-500" />{user.address}</p>
                        </div>
                    </div>
                </div>

                <aside className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                            <UserRound className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Status</p>
                            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{user.status}</p>
                        </div>
                    </div>

                    <Button className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Edit User</Button>
                    <Button variant="outline" className="mt-3 h-11 w-full rounded-xl">Suspend / Activate</Button>
                </aside>
            </section>
        </div>
    );
}
