import { notFound } from "next/navigation";
import { CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { blockUserByAdmin, getAdminUserById } from "@/services/user";

type AdminUserDetailPageProps = {
    params: Promise<{ id: string }>;
};

type RawUser = {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
    status?: string;
    isBlocked?: boolean;
    createdAt?: string;
    address?: string;
    location?: string;
};

type UserByIdResponse = {
    success?: boolean;
    data?: {
        data?: RawUser;
    } | RawUser;
};

function formatDate(value?: string): string {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function normalizeRole(role?: string): string {
    const normalized = (role || "").toUpperCase();
    if (normalized === "ADMIN") return "Admin";
    if (normalized === "CUSTOMER") return "Customer";
    if (normalized === "PROVIDER") return "Provider";
    if (normalized === "MODERATOR") return "Moderator";
    return "Customer";
}

function normalizeStatus(user: RawUser): string {
    if (typeof user.isBlocked === "boolean") {
        return user.isBlocked ? "Suspended" : "Active";
    }

    const normalized = (user.status || "").toUpperCase();
    if (normalized === "SUSPENDED" || normalized === "BLOCKED" || normalized === "INACTIVE") {
        return "Suspended";
    }

    return "Active";
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
    const { id } = await params;

    const response = (await getAdminUserById(id)) as UserByIdResponse;
    const user = (response?.data as { data?: RawUser } | undefined)?.data ?? (response?.data as RawUser | undefined);

    if (!user) {
        notFound();
    }

    const displayUser = {
        id: user.id || user._id || id,
        name: user.name || user.fullName || "Unknown User",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role: normalizeRole(user.role),
        joinDate: formatDate(user.createdAt),
        address: user.address || user.location || "N/A",
        status: normalizeStatus(user),
    };

    async function toggleBlockAction() {
        "use server";
        await blockUserByAdmin(displayUser.id);
    }

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">User Details</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{displayUser.name}</h1>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Email</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><Mail className="h-4 w-4 text-orange-500" />{displayUser.email}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Phone</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><Phone className="h-4 w-4 text-orange-500" />{displayUser.phone}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Role</p>
                            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{displayUser.role}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Join Date</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><CalendarDays className="h-4 w-4 text-orange-500" />{displayUser.joinDate}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Address</p>
                            <p className="mt-2 inline-flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-100"><MapPin className="mt-0.5 h-4 w-4 text-orange-500" />{displayUser.address}</p>
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
                            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{displayUser.status}</p>
                        </div>
                    </div>

                    <Button className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Edit User</Button>
                    <form action={toggleBlockAction}>
                        <Button variant="outline" type="submit" className="mt-3 h-11 w-full rounded-xl">
                            {displayUser.status === "Active" ? "Suspend" : "Activate"}
                        </Button>
                    </form>
                </aside>
            </section>
        </div>
    );
}
