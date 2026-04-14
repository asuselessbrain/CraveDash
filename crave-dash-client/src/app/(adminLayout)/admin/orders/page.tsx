import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import SearchComponent from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import { getOrders } from "@/services/order";

type AdminOrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type RawOrderItem = {
    name?: string;
    title?: string;
    mealName?: string;
    quantity?: number;
    meal?: {
        name?: string;
        title?: string;
    };
};

type RawOrder = {
    id?: string;
    _id?: string;
    orderId?: string;
    orderNumber?: string;
    createdAt?: string;
    orderStatus?: string;
    status?: string;
    total?: number | string;
    subtotal?: number | string;
    deliveryFee?: number | string;
    userEmail?: string;
    customer?: string;
    deliveryAddress?: {
        fullName?: string;
    };
    items?: RawOrderItem[];
    orderItems?: RawOrderItem[];
};

type ApiResponse = {
    data?: {
        data?: RawOrder[];
        meta?: {
            totalPages: number;
        };
    };
};

type SearchParams = {
    page?: string;
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

const statusFilters: Array<{ label: string; value?: AdminOrderStatus }> = [
    { label: "All" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Preparing", value: "PREPARING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
];

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

function normalizeStatus(status?: string): AdminOrderStatus {
    const normalized = (status || "").toUpperCase();
    if (["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(normalized)) {
        return normalized as AdminOrderStatus;
    }
    return "PENDING";
}

function formatStatus(status: AdminOrderStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusStyles(status: AdminOrderStatus): string {
    switch (status) {
        case "DELIVERED":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
        case "SHIPPED":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
        case "PREPARING":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
        case "CONFIRMED":
            return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20";
        case "PENDING":
            return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20";
        case "CANCELLED":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20";
    }
}

function getItemCount(order: RawOrder): number {
    const items = order.items ?? order.orderItems ?? [];
    return items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
}

function buildStatusHref(current: SearchParams, status?: AdminOrderStatus): string {
    const params = new URLSearchParams();

    if (current.searchTerm) params.set("searchTerm", current.searchTerm);
    if (current.sortBy) params.set("sortBy", current.sortBy);
    if (current.sortOrder) params.set("sortOrder", current.sortOrder);
    params.set("page", "1");

    if (status) {
        params.set("status", status);
    }

    const query = params.toString();
    return query ? `?${query}` : "?";
}

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) - 1 || 0;

    const orders = (await getOrders({
        searchTerm: resolvedSearchParams.searchTerm,
        skip: currentPage,
        orderStatus: resolvedSearchParams.status,
        sortBy: resolvedSearchParams.sortBy,
        sortOrder: resolvedSearchParams.sortOrder,
    })) as ApiResponse;

    const ordersList = orders.data?.data ?? [];
    const totalPages = orders.data?.meta?.totalPages ?? 1;

    const normalizedOrders = ordersList.map((order, index) => {
        const apiId = order.id || order._id || order.orderId || `order-${index + 1}`;
        const displayId = order.orderNumber || order.orderId || order.id || order._id || `order-${index + 1}`;
        const status = normalizeStatus(order.orderStatus || order.status);
        const customer = order.customer || order.deliveryAddress?.fullName || order.userEmail || "Unknown customer";
        const itemCount = getItemCount(order);

        return {
            id: apiId,
            displayId,
            customer,
            itemCount,
            status,
            date: formatDate(order.createdAt),
            total: Number(order.total) || 0,
        };
    });

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Orders</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">All Orders</h1>
                </div>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchComponent placeholder="Search orders..." debounceWait={300} />
                <SortingComponent
                    className="h-12 rounded-2xl"
                    label="Sort"
                    options={[
                        { label: "Date Oldest", sortBy: "createdAt", sortOrder: "asc" },
                        { label: "Date Newest", sortBy: "createdAt", sortOrder: "desc" },
                        { label: "Total Low", sortBy: "total", sortOrder: "asc" },
                        { label: "Total High", sortBy: "total", sortOrder: "desc" },
                    ]}
                />
            </div>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((item) => (
                        <Link
                            key={item.label}
                            href={buildStatusHref(resolvedSearchParams, item.value)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${resolvedSearchParams.status === item.value || (!resolvedSearchParams.status && !item.value)
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    {normalizedOrders.length} order{normalizedOrders.length === 1 ? "" : "s"} found
                </p>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {normalizedOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.displayId}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">${order.total.toFixed(2)}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(order.status)}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-4 py-4">
                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                            <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {normalizedOrders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No orders found.
                    </div>
                )}

                <PaginationComponent totalPage={totalPages} />
            </section>
        </div>
    );
}
