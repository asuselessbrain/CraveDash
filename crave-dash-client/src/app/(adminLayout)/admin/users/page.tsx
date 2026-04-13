import Link from "next/link";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchComponent from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import { getAdminUsers } from "@/services/user";
import SuspendUserAction from "@/components/modules/admin/user/SuspendUserAction";

type SearchParams = {
    page?: string;
    searchTerm?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

type RawUser = {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
    isBlocked?: boolean;
    createdAt?: string;
    joinDate?: string;
};

type UsersResponse = {
    success?: boolean;
    data?: {
        data?: RawUser[];
        meta?: {
            totalPages?: number;
        };
    } | RawUser[];
};

type UiUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Suspended";
    joinDate: string;
};

const roleOptions = ["All", "Admin", "Customer", "Provider", "Moderator"] as const;

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

function normalizeStatus(user: RawUser): "Active" | "Suspended" {
    if (typeof user.isBlocked === "boolean") {
        return user.isBlocked ? "Suspended" : "Active";
    }

    const normalized = (user.status || "").toUpperCase();
    if (normalized === "SUSPENDED" || normalized === "BLOCKED" || normalized === "INACTIVE") {
        return "Suspended";
    }

    return "Active";
}

function roleBadge(role: string) {
    return role === "Admin"
        ? "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300"
        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function buildRoleHref(current: SearchParams, role: string): string {
    const params = new URLSearchParams();

    if (current.searchTerm) params.set("searchTerm", current.searchTerm);
    if (current.sortBy) params.set("sortBy", current.sortBy);
    if (current.sortOrder) params.set("sortOrder", current.sortOrder);
    params.set("page", "1");

    if (role !== "All") {
        params.set("role", role.toUpperCase());
    }

    const query = params.toString();
    return query ? `?${query}` : "?";
}

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) - 1 || 0;
    const currentRole = resolvedSearchParams.role?.toUpperCase() || "All";

    const response = (await getAdminUsers({
        searchTerm: resolvedSearchParams.searchTerm,
        role: resolvedSearchParams.role,
        sortBy: resolvedSearchParams.sortBy,
        sortOrder: resolvedSearchParams.sortOrder,
        skip: currentPage,
    })) as UsersResponse;

    const usersList = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data ?? [];

    const totalPages = Array.isArray(response?.data)
        ? 1
        : response?.data?.meta?.totalPages ?? 1;

    const users: UiUser[] = usersList.map((user, index) => ({
        id: user.id || user._id || `user-${index + 1}`,
        name: user.name || user.fullName || "Unknown User",
        email: user.email || "N/A",
        role: normalizeRole(user.role),
        status: normalizeStatus(user),
        joinDate: formatDate(user.createdAt || user.joinDate),
    }));

    

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Users</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">User Directory</h1>
                </div>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchComponent placeholder="Search by name or email" debounceWait={300} />
                <SortingComponent
                    className="h-12 rounded-2xl"
                    label="Sort"
                    options={[
                        { label: "Name", value: "name" },
                        { label: "Join Date", value: "createdAt" },
                    ]}
                />
            </div>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => (
                        <Link
                            key={role}
                            href={buildRoleHref(resolvedSearchParams, role)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                                (role === "All" && currentRole === "All") || currentRole === role.toUpperCase()
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                            }`}
                        >
                            {role}
                        </Link>
                    ))}
                </div>

                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    {users.length} user{users.length === 1 ? "" : "s"} found
                </p>

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
                            {users.map((user) => (
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
                                            <SuspendUserAction id={user.id} status={user.status} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No users matched your search or role filter.
                    </div>
                )}

                <PaginationComponent totalPage={totalPages} />
            </section>
        </div>
    );
}
