import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, CircleDot, Clock3, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProviderOrderById } from "@/services/order";

type ProviderOrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type RawOrderItem = {
  name?: string;
  title?: string;
  mealName?: string;
  quantity?: number;
  image?: string;
  price?: number | string;
  unitPrice?: number | string;
  totalPrice?: number | string;
  meal?: {
    name?: string;
    title?: string;
    image?: string;
    price?: number | string;
  };
};

type RawOrder = {
  id?: string;
  _id?: string;
  orderId?: string;
  orderNumber?: string;
  createdAt?: string;
  dateLabel?: string;
  orderStatus?: string;
  status?: string;
  statusLabel?: string;
  total?: number | string;
  subtotal?: number | string;
  deliveryFee?: number | string;
  tax?: number | string;
  pricing?: {
    subtotal?: number | string;
    deliveryFee?: number | string;
    tax?: number | string;
    total?: number | string;
  };
  deliveryAddress?: {
    fullName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    city?: string;
    area?: string;
    deliveryInstructions?: string;
  };
  address?: string;
  userEmail?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items?: RawOrderItem[];
  orderItems?: RawOrderItem[];
};

type ProviderOrderDetailsResponse = {
  success?: boolean;
  message?: string;
  data?: RawOrder;
};

type UiOrderItem = {
  name: string;
  image: string;
  qty: number;
  price: number;
};

type UiOrder = {
  id: string;
  date: string;
  status: ProviderOrderStatus;
  statusLabel: string;
  address: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  itemsList: UiOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

const statusSteps = [
  { label: "Placed", icon: CircleDot },
  { label: "Confirmed", icon: BadgeCheck },
  { label: "Preparing", icon: Clock3 },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: BadgeCheck },
];

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
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "PREPARING":
      return "Preparing";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
  }
}

function statusStyles(status: ProviderOrderStatus) {
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

function toOrderDate(rawOrder: RawOrder): string {
  if (rawOrder.dateLabel) return rawOrder.dateLabel;

  const source = rawOrder.createdAt;
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

function toOrderAddress(rawOrder: RawOrder): string {
  const addressParts = [
    rawOrder.deliveryAddress?.streetAddress,
    rawOrder.deliveryAddress?.area,
    rawOrder.deliveryAddress?.city,
  ].filter(Boolean);

  if (addressParts.length > 0) {
    return addressParts.join(", ");
  }

  return rawOrder.address || "Address not available";
}

function toOrderItems(rawOrder: RawOrder): UiOrderItem[] {
  const rawItems = rawOrder.items ?? rawOrder.orderItems ?? [];

  return rawItems.map((item, index) => {
    const qty = Math.max(1, toNumber(item.quantity, 1));
    const unitPrice = toNumber(item.unitPrice ?? item.price ?? item.meal?.price, 0);
    const lineTotal = toNumber(item.totalPrice, unitPrice * qty);

    return {
      name: item.meal?.name || item.meal?.title || item.mealName || item.name || item.title || `Item ${index + 1}`,
      image: item.meal?.image || item.image || "/categories/pizza.svg",
      qty,
      price: lineTotal,
    };
  });
}

function normalizeOrder(rawOrder: RawOrder, fallbackId: string): UiOrder {
  const itemsList = toOrderItems(rawOrder);
  const subtotalFromItems = itemsList.reduce((sum, item) => sum + item.price, 0);

  const subtotal = toNumber(rawOrder.pricing?.subtotal ?? rawOrder.subtotal, subtotalFromItems);
  const deliveryFee = toNumber(rawOrder.pricing?.deliveryFee ?? rawOrder.deliveryFee, 0);
  const tax = toNumber(rawOrder.pricing?.tax ?? rawOrder.tax, 0);
  const total = toNumber(rawOrder.pricing?.total ?? rawOrder.total, subtotal + deliveryFee + tax);
  const adjustedTax = tax || Math.max(0, total - subtotal - deliveryFee);

  const status = normalizeStatus(rawOrder.orderStatus ?? rawOrder.status);

  return {
    id: rawOrder.orderNumber || rawOrder.orderId || rawOrder.id || rawOrder._id || fallbackId,
    date: toOrderDate(rawOrder),
    status,
    statusLabel: rawOrder.statusLabel || formatStatus(status),
    address: toOrderAddress(rawOrder),
    customerName: rawOrder.deliveryAddress?.fullName || "N/A",
    customerPhone: rawOrder.deliveryAddress?.phoneNumber || "N/A",
    customerEmail: rawOrder.userEmail || "N/A",
    paymentMethod: rawOrder.paymentMethod || "N/A",
    paymentStatus: rawOrder.paymentStatus || "N/A",
    itemsList,
    subtotal,
    deliveryFee,
    tax: adjustedTax,
    total,
  };
}

function getActiveStepIndex(status: ProviderOrderStatus): number {
  if (status === "CANCELLED") return -1;
  if (status === "PENDING") return 0;
  if (status === "CONFIRMED") return 1;
  if (status === "PREPARING") return 2;
  if (status === "SHIPPED") return 3;
  return 4;
}

export default async function ProviderOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = (await getProviderOrderById(id)) as ProviderOrderDetailsResponse;
  const rawOrder = response?.data;

  if (!rawOrder) {
    notFound();
  }

  const order = normalizeOrder(rawOrder, id);
  const activeIndex = getActiveStepIndex(order.status);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
        <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{order.id}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-950">
                <CalendarDays className="h-4 w-4 text-orange-500" /> {order.date}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold ${statusStyles(order.status)}`}>
                <BadgeCheck className="h-4 w-4" /> {order.statusLabel}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer address for this order.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{order.address}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{order.customerName} • {order.customerPhone}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
          </div>

          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
            <div className="mt-5 space-y-4">
              {order.itemsList.map((item) => (
                <article key={`${item.name}-${item.qty}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">৳{item.price.toFixed(2)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold">৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery Fee</span>
                <span className="font-semibold">৳{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Tax</span>
                <span className="font-semibold">৳{order.tax.toFixed(2)}</span>
              </div>
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Status Tracker</h2>
            <div className="mt-5 space-y-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const active = index <= activeIndex;

                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${active ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-semibold ${active ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.status === "DELIVERED" && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <h2 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">Order delivered</h2>
              <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">You can close this order flow and focus on new requests.</p>
              <Button className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Back to Orders</Button>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
