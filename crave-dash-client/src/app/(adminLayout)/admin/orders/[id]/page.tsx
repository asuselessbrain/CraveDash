import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";

import { getAdminOrderById, getOrderById } from "@/services/order";

type AdminOrderDetailPageProps = {
    params: Promise<{ id: string }>;
};

type RawOrderItem = {
    id?: string;
    _id?: string;
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
    pricing?: {
        total?: number | string;
    };
    deliveryAddress?: {
        fullName?: string;
        streetAddress?: string;
        city?: string;
        area?: string;
    };
    items?: RawOrderItem[];
    orderItems?: RawOrderItem[];
};

type OrderByIdResponse = {
    success?: boolean;
    data?: {
        data?: RawOrder;
    } | RawOrder;
};

type OrderProgressStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const baseOrderFlow: OrderProgressStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED"];

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

function normalizeStatus(status?: string): OrderProgressStatus {
    const normalized = (status || "").toUpperCase();

    if (normalized === "PENDING" || normalized === "PLACED") return "PENDING";
    if (normalized === "CONFIRMED") return "CONFIRMED";
    if (normalized === "PREPARING") return "PREPARING";
    if (normalized === "SHIPPED" || normalized === "ON_THE_WAY") return "SHIPPED";
    if (normalized === "DELIVERED") return "DELIVERED";
    if (normalized === "CANCELLED") return "CANCELLED";

    return "PENDING";
}

function formatStatus(status: OrderProgressStatus): string {
    if (status === "PENDING") return "Pending";
    if (status === "CONFIRMED") return "Confirmed";
    if (status === "PREPARING") return "Preparing";
    if (status === "SHIPPED") return "Shipped";
    if (status === "DELIVERED") return "Delivered";
    return "Cancelled";
}

function getTrackerConfig(status: OrderProgressStatus): { steps: OrderProgressStatus[]; activeIndex: number } {
    if (status === "CANCELLED") {
        return {
            steps: ["PENDING", "CANCELLED"],
            activeIndex: 1,
        };
    }

    const steps = baseOrderFlow;
    const activeIndex = steps.indexOf(status);

    return {
        steps,
        activeIndex: activeIndex === -1 ? 0 : activeIndex,
    };
}

function getItemName(item: RawOrderItem): string {
    return item.meal?.name || item.meal?.title || item.mealName || item.name || item.title || "Unnamed item";
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    const { id } = await params;
    const adminResponse = (await getAdminOrderById(id)) as OrderByIdResponse;
    const adminOrder = (adminResponse?.data as { data?: RawOrder } | undefined)?.data ?? (adminResponse?.data as RawOrder | undefined);

    const fallbackResponse = !adminOrder || adminResponse?.success === false
        ? ((await getOrderById(id)) as OrderByIdResponse)
        : undefined;

    const fallbackOrder = fallbackResponse
        ? ((fallbackResponse?.data as { data?: RawOrder } | undefined)?.data ?? (fallbackResponse?.data as RawOrder | undefined))
        : undefined;

    const order = adminOrder ?? fallbackOrder;

    if (!order) {
        notFound();
    }

    const status = normalizeStatus(order.orderStatus ?? order.status);
    const date = formatDate(order.createdAt);
    const items = order.items ?? order.orderItems ?? [];
    const itemsCount = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    const total = Number(order.total ?? order.pricing?.total ?? 0) || 0;

    const addressParts = [
        order.deliveryAddress?.streetAddress,
        order.deliveryAddress?.area,
        order.deliveryAddress?.city,
    ].filter(Boolean);
    const address = addressParts.length ? addressParts.join(", ") : "N/A";
    const tracker = getTrackerConfig(status);

    const headerId = order.orderNumber || order.orderId || order.id || order._id || id;

    return (
        <div className="space-y-6">
            <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{headerId}</h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950"><CalendarDays className="h-4 w-4 text-orange-500" />{date}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950"><BadgeCheck className="h-4 w-4 text-orange-500" />{formatStatus(status)}</span>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
                        <p className="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><MapPin className="mt-0.5 h-4 w-4 text-orange-500" />{address}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
                        <div className="mt-4 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id ?? item._id ?? `${getItemName(item)}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{getItemName(item)}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Included in this order</p>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">x{item.quantity ?? 1}</p>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                                    No items found for this order.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Total Amount</h2>
                        <p className="mt-2 text-3xl font-black text-orange-600 dark:text-orange-300">${total.toFixed(2)}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Quick Info</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Items count: {itemsCount}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Status Tracker</h2>
                        <div className="mt-4 space-y-3">
                            {tracker.steps.map((step, index) => {
                                const isCompleted = index <= tracker.activeIndex;
                                const isActive = index === tracker.activeIndex;

                                return (
                                    <div key={step} className="flex items-center gap-3">
                                        <span
                                            className={`h-3 w-3 rounded-full ${
                                                isCompleted
                                                    ? "bg-orange-500"
                                                    : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                        />
                                        <p
                                            className={`text-sm font-semibold ${
                                                isActive
                                                    ? "text-orange-600 dark:text-orange-300"
                                                    : isCompleted
                                                        ? "text-slate-900 dark:text-slate-100"
                                                        : "text-slate-500 dark:text-slate-400"
                                            }`}
                                        >
                                            {formatStatus(step)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}
