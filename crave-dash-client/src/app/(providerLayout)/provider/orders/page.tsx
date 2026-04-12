import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import SearchComponent from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import OrderStatusUpdater from "@/components/modules/Provider/Order/OrderStatusUpdater";
import { getProviderOrders, updateProviderOrderStatus } from "@/services/order";

type SearchParams = {
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
};

type ProviderOrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type ProviderNextStatus = "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
    createdAt?: string;
    orderStatus?: string;
    total?: number | string;
    subtotal?: number | string;
    deliveryFee?: number | string;
    userEmail?: string;
    deliveryAddress?: {
        fullName?: string;
    };
    items?: RawOrderItem[];
    orderItems?: RawOrderItem[];
};

type UiOrder = {
    id: string;
    date: string;
    customer: string;
    items: string;
    status: ProviderOrderStatus;
    total: number;
};

const statusFilters: Array<{ label: string; value?: ProviderOrderStatus }> = [
    { label: "All" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Preparing", value: "PREPARING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const orderStatusTransitions: Record<ProviderOrderStatus, ProviderNextStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
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

function toNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStatus(status?: string): ProviderOrderStatus {
    const normalized = (status || "").toUpperCase();

    if (normalized === "PENDING") return "PENDING";
    if (normalized === "CONFIRMED") return "CONFIRMED";
    if (normalized === "PREPARING") return "PREPARING";
    if (normalized === "SHIPPED") return "SHIPPED";
    if (normalized === "DELIVERED") return "DELIVERED";
    if (normalized === "CANCELLED") return "CANCELLED";

    return "PENDING";
}

function formatStatus(status: ProviderOrderStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusStyles(status: ProviderOrderStatus): string {
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
    }
}

function getItemNames(order: RawOrder): string[] {
    const items = order.items ?? order.orderItems ?? [];

    return items
        .map((item) => item.meal?.name || item.meal?.title || item.mealName || item.name || item.title)
        .filter((name): name is string => Boolean(name));
}

function normalizeOrder(order: RawOrder, index: number): UiOrder {
    const itemNames = getItemNames(order);

    return {
        id: order.id || order.orderId || order._id || `order-${index + 1}`,
        date: formatDate(order.createdAt),
        customer: order.deliveryAddress?.fullName || order.userEmail || "Unknown customer",
        items: itemNames.length > 0 ? itemNames.join(", ") : "No items listed",
        status: normalizeStatus(order.orderStatus),
        total: toNumber(order.total, toNumber(order.subtotal, 0) + toNumber(order.deliveryFee, 0)),
    };
}

function buildQueryString(params: SearchParams) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, String(value));
        }
    });

    return query.toString();
}

export default async function ProviderOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedSearchParams = await searchParams;

    const selectedStatus = (resolvedSearchParams.status || "").toUpperCase() as ProviderOrderStatus | "";
    const searchTerm = resolvedSearchParams.searchTerm || "";
    const sortBy = resolvedSearchParams.sortBy || "createdAt";
    const sortOrder = resolvedSearchParams.sortOrder === "desc" ? "desc" : "asc";

    const page = Number(resolvedSearchParams.page) - 1 || 0;
    const limit = 10;

    const ordersResponse = await getProviderOrders({
        searchTerm,
        status: selectedStatus || undefined,
        sortBy,
        sortOrder,
        skip: page,
        take: limit,
    });


    const rawOrders: RawOrder[] = ordersResponse?.data?.data || [];
    const orders = rawOrders.map(normalizeOrder);

    console.log(orders)

    const totalOrders = Number(ordersResponse?.data?.meta?.total ?? orders.length);
    const computedTotalPages = Math.ceil(totalOrders / limit);
    const apiTotalPages = ordersResponse?.data?.meta?.totalPages;
    const totalPages = Number(apiTotalPages ?? computedTotalPages ?? 1);

    async function updateOrderStatusAction(formData: FormData) {
        "use server";

        const orderId = String(formData.get("orderId") || "");
        const orderStatus = String(formData.get("orderStatus") || "") as ProviderNextStatus;

        if (!orderId || !orderStatus) {
            return;
        }

        await updateProviderOrderStatus(orderId, { orderStatus });
        revalidatePath("/provider/orders");
    }

    return (
        <div className="space-y-6">
            <header>
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Orders</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Order Management</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track order flow and inspect customer details from live data.</p>
            </header>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchComponent placeholder="Search by order, customer, or item..." debounceWait={300} />
                    <SortingComponent
                        className="h-12 rounded-2xl"
                        label="Sort"
                        defaultSortBy="createdAt"
                        defaultSortOrder="asc"
                        options={[
                            { label: "Date", value: "createdAt" },
                            { label: "Total", value: "total" },
                            { label: "Status", value: "orderStatus" },
                        ]}
                    />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {statusFilters.map((statusFilter) => {
                        const queryString = buildQueryString({
                            searchTerm,
                            sortBy,
                            sortOrder,
                            status: statusFilter.value,
                            page: "1",
                        });

                        const isActive = (statusFilter.value ?? "") === selectedStatus || (!statusFilter.value && !selectedStatus);

                        return (
                            <Link
                                key={statusFilter.label}
                                href={queryString ? `/provider/orders?${queryString}` : "/provider/orders"}
                                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${isActive ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                            >
                                {statusFilter.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Change Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {orders.map((order) => (
                                <tr key={order.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.items}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {orderStatusTransitions[order.status].length > 0 ? (
                                            <OrderStatusUpdater
                                                orderId={order.id}
                                                options={orderStatusTransitions[order.status]}
                                                action={updateOrderStatusAction}
                                            />
                                        ) : (
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">No changes</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-4 py-4">
                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                            <Link href={`/provider/orders/${encodeURIComponent(order.id)}`}>View Details <ChevronRight className="h-4 w-4" /></Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                        No orders found for this filter.
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-8">
                        <PaginationComponent totalPage={Math.max(1, totalPages)} />
                    </div>
                )}
            </section>
        </div>
    );
}
