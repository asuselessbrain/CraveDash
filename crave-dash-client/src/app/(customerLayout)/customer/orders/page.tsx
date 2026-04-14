import Link from "next/link";
import { ChevronRight, Clock3, PackageCheck, Truck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import SearchComponent from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import { getCustomerOrders } from "@/services/order";

type OrderStatusFilter = "All" | "Delivered" | "On the way" | "Preparing" | "Pending" | "Cancelled";

type SearchParams = {
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
};

type RawOrderItem = {
    name?: string;
    title?: string;
    mealName?: string;
    quantity?: number;
    totalPrice?: number | string;
    price?: number | string;
    meal?: {
        name?: string;
        title?: string;
    };
};

type RawOrder = {
    id?: string;
    _id?: string;
    orderId?: string;
    status?: string;
    orderStatus?: string;
    createdAt?: string;
    date?: string;
    total?: number | string;
    totalAmount?: number | string;
    subtotal?: number | string;
    deliveryFee?: number | string;
    pricing?: {
        total?: number | string;
    };
    items?: RawOrderItem[];
    orderItems?: RawOrderItem[];
};

type UiOrder = {
    id: string;
    date: string;
    status: Exclude<OrderStatusFilter, "All">;
    total: number;
    itemsCount: number;
    items: string[];
};

const statusOptions: OrderStatusFilter[] = ["All", "Delivered", "On the way", "Preparing", "Pending", "Cancelled"];

function normalizeStatus(status?: string): Exclude<OrderStatusFilter, "All"> {
    const value = (status || "").toLowerCase();

    if (value.includes("cancel")) return "Cancelled";
    if (value.includes("pending")) return "Pending";
    if (value.includes("prepar")) return "Preparing";
    if (value.includes("way") || value.includes("transit") || value.includes("ship")) return "On the way";
    if (value.includes("deliver")) return "Delivered";

    return "Preparing";
}

function statusStyles(status: Exclude<OrderStatusFilter, "All">) {
    switch (status) {
        case "Delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
        case "On the way":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
        case "Preparing":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
        case "Pending":
            return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20";
        case "Cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
    }
}

function statusIcon(status: Exclude<OrderStatusFilter, "All">) {
    switch (status) {
        case "Delivered":
            return <PackageCheck className="h-4 w-4" />;
        case "On the way":
            return <Truck className="h-4 w-4" />;
        case "Preparing":
            return <Clock3 className="h-4 w-4" />;
        case "Pending":
            return <Clock3 className="h-4 w-4" />;
        case "Cancelled":
            return <XCircle className="h-4 w-4" />;
    }
}

function toOrderDate(rawOrder: RawOrder): string {
    const source = rawOrder.createdAt || rawOrder.date;
    if (!source) return "N/A";

    const parsedDate = new Date(source);
    if (Number.isNaN(parsedDate.getTime())) {
        return String(source);
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function toOrderTotal(rawOrder: RawOrder): number {
    const total = Number(rawOrder.pricing?.total ?? rawOrder.totalAmount ?? rawOrder.total ?? rawOrder.subtotal ?? 0);
    return Number.isFinite(total) ? total : 0;
}

function toOrderItems(rawOrder: RawOrder): string[] {
    const items = rawOrder.items ?? rawOrder.orderItems ?? [];

    const names = items
        .map((item) => item.meal?.name || item.meal?.title || item.mealName || item.name || item.title)
        .filter((name): name is string => Boolean(name));

    return names;
}

function toItemsCount(rawOrder: RawOrder): number {
    const items = rawOrder.items ?? rawOrder.orderItems ?? [];
    if (!items.length) return 0;

    return items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function toApiOrderStatus(status: OrderStatusFilter): string | undefined {
    switch (status) {
        case "Delivered":
            return "DELIVERED";
        case "On the way":
            return "SHIPPED";
        case "Preparing":
            return "PREPARING";
        case "Pending":
            return "PENDING";
        case "Cancelled":
            return "CANCELLED";
        default:
            return undefined;
    }
}

function normalizeOrder(rawOrder: RawOrder, index: number): UiOrder {
    const items = toOrderItems(rawOrder);

    return {
        id: rawOrder.id || rawOrder.orderId || rawOrder._id || `ORD-${index + 1}`,
        date: toOrderDate(rawOrder),
        status: normalizeStatus(rawOrder.orderStatus ?? rawOrder.status),
        total: toOrderTotal(rawOrder),
        itemsCount: toItemsCount(rawOrder),
        items,
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

export default async function CustomerOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedSearchParams = await searchParams;

    const selectedStatus = (resolvedSearchParams.status as OrderStatusFilter) || "All";
    const searchTerm = resolvedSearchParams.searchTerm || "";
    const sortBy = resolvedSearchParams.sortBy || "createdAt";
    const sortOrder = resolvedSearchParams.sortOrder === "desc" ? "desc" : "asc";

    const page = Number(resolvedSearchParams.page) - 1 || 0;
    const limit = 10;

    const ordersResponse = await getCustomerOrders({
        searchTerm,
        orderStatus: toApiOrderStatus(selectedStatus),
        sortBy,
        sortOrder,
        skip: page,
        take: limit,
    });


    const rawOrders: RawOrder[] = ordersResponse?.data?.data || ordersResponse?.data || [];
    const orders = rawOrders.map(normalizeOrder);

    const totalOrders = Number(ordersResponse?.data?.meta?.total ?? ordersResponse?.meta?.total ?? orders.length);
    const computedTotalPages = Math.ceil(totalOrders / limit);
    const apiTotalPages =
        ordersResponse?.data?.meta?.totalPages ??
        ordersResponse?.data?.meta?.totalPage ??
        ordersResponse?.meta?.totalPages ??
        ordersResponse?.meta?.totalPage;
    const totalPages = Math.max(1, Number(apiTotalPages ?? computedTotalPages ?? 1));

    return (
        <section className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">My Orders</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Order History</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track every meal you ordered from one place.</p>
            </header>

            <section className="rounded-3xl border border-orange-200/70 bg-white/85 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchComponent placeholder="Search by order ID or item name..." debounceWait={300} />
                    <SortingComponent
                        className="h-12 rounded-2xl"
                        label="Sort"
                        options={[
                            { label: "Date Oldest", sortBy: "createdAt", sortOrder: "asc" },
                            { label: "Date Newest", sortBy: "createdAt", sortOrder: "desc" },
                            { label: "Total Low", sortBy: "total", sortOrder: "asc" },
                            { label: "Total High", sortBy: "total", sortOrder: "desc" },
                            { label: "Status Asc", sortBy: "orderStatus", sortOrder: "asc" },
                            { label: "Status Desc", sortBy: "orderStatus", sortOrder: "desc" },
                        ]}
                    />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {statusOptions.map((status) => {
                        const queryString = buildQueryString({
                            searchTerm,
                            sortBy,
                            sortOrder,
                            status: status === "All" ? undefined : status,
                            page: "1",
                        });

                        return (
                            <Link
                                key={status}
                                href={queryString ? `/customer/orders?${queryString}` : "/customer/orders"}
                                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${selectedStatus === status ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                            >
                                {status}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 lg:block">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-5 py-4">Order ID</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Total</th>
                                <th className="px-5 py-4">Items</th>
                                <th className="px-5 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {orders.map((order) => (
                                <tr key={order.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{order.id}</p>
                                        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                            {order.items.length > 0 ? order.items.join(", ") : "No items listed"}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                                            {statusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.itemsCount}</td>
                                    <td className="px-5 py-4 text-right">
                                        <Button asChild variant="outline" className="rounded-xl">
                                            <Link href={`/customer/orders/${order.id.toLowerCase()}`}>View Details <ChevronRight className="h-4 w-4" /></Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 space-y-4 lg:hidden">
                    {orders.map((order) => (
                        <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{order.id}</h2>
                                    <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                        {order.items.length > 0 ? order.items.join(", ") : "No items listed"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.date}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
                                    {statusIcon(order.status)}
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                                    <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Total</p>
                                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                                    <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Items</p>
                                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">{order.itemsCount}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                                <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                                    {order.items.length > 0 ? order.items.join(", ") : "No items listed"}
                                </p>
                                <Button asChild variant="outline" className="rounded-xl">
                                    <Link href={`/customer/orders/${order.id.toLowerCase()}`}>View Details</Link>
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        No orders matched this filter.
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-8">
                        <PaginationComponent totalPage={totalPages} />
                    </div>
                )}
            </section>
        </section>
    );
}
