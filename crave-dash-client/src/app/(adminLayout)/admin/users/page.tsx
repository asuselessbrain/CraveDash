"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminUsers, type AdminRole } from "../data";

const roleOptions: Array<"All" | AdminRole> = ["All", "Admin", "Customer", "Provider", "Moderator"];

function roleBadge(role: AdminRole) {
    return role === "Admin" ? "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"All" | AdminRole>("All");
    const [users, setUsers] = useState(adminUsers);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = [user.name, user.email].some((field) => field.toLowerCase().includes(search.toLowerCase()));
            const matchesRole = roleFilter === "All" || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [roleFilter, search, users]);

    const toggleStatus = (id: string) => {
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user)));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Users</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">User Directory</h1>
                </div>

                <div className="relative w-full max-w-xl">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950" />
                </div>
            </header>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => setRoleFilter(role)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${roleFilter === role ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Join Date</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                                <UserRound className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${roleBadge(user.role)}`}>{user.role}</span></td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.joinDate}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Button asChild variant="outline" size="sm" className="rounded-xl">
                                                <Link href={`/admin/users/${user.id}`}>View Details</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => toggleStatus(user.id)} className="rounded-xl">
                                                <ShieldCheck className="h-4 w-4" /> {user.status === "Active" ? "Suspend" : "Activate"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No users matched your search or role filter.
                    </div>
                )}
            </section>
        </div>
    );
}
