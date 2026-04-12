import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, CheckCircle2, CircleDot, Clock3, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCustomerOrderById } from "@/services/order";

type CustomerOrderStatus = "Delivered" | "On the way" | "Preparing" | "Confirmed" | "Pending" | "Cancelled";

type RawOrderItem = {
  name?: string;
  title?: string;
  mealName?: string;
  image?: string;
  price?: number | string;
  unitPrice?: number | string;
  totalPrice?: number | string;
  quantity?: number;
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
  status?: string;
  orderStatus?: string;
  createdAt?: string;
  date?: string;
  address?: string;
  deliveryAddress?: {
    fullName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    city?: string;
    area?: string;
    deliveryInstructions?: string;
  };
  pricing?: {
    subtotal?: number | string;
    deliveryFee?: number | string;
    tax?: number | string;
    total?: number | string;
  };
  subtotal?: number | string;
  deliveryFee?: number | string;
  tax?: number | string;
  total?: number | string;
  totalAmount?: number | string;
  items?: RawOrderItem[];
  orderItems?: RawOrderItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  userEmail?: string;
};

type OrderDetailsApiResponse = {
  success?: boolean;
  message?: string;
  data?: RawOrder;
};

type UiOrderItem = {
  name: string;
  image: string;
  quantity: number;
  lineTotal: number;
};

type UiOrder = {
  id: string;
  date: string;
  status: CustomerOrderStatus;
  address: string;
  customerName: string;
  customerPhone: string;
  userEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  items: UiOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

const inProgressTimeline = [
  { label: "Order Placed", icon: CircleDot },
  { label: "Confirmed", icon: BadgeCheck },
  { label: "Preparing", icon: Clock3 },
  { label: "On the Way", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const cancelledTimeline = [
  { label: "Order Placed", icon: CircleDot },
  { label: "Cancelled", icon: BadgeCheck },
];

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStatus(status?: string): CustomerOrderStatus {
  const value = (status || "").toLowerCase();

  if (value.includes("cancel")) return "Cancelled";
  if (value.includes("pending")) return "Pending";
  if (value.includes("confirm")) return "Confirmed";
  if (value.includes("prepar")) return "Preparing";
  if (value.includes("way") || value.includes("transit") || value.includes("ship")) return "On the way";
  if (value.includes("deliver")) return "Delivered";

  return "Preparing";
}

function statusStyles(status: CustomerOrderStatus) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20";
    case "On the way":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20";
    case "Preparing":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20";
    case "Confirmed":
      return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20";
    case "Pending":
      return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20";
  }
}

function getTrackerConfig(status: CustomerOrderStatus) {
  if (status === "Cancelled") {
    return {
      timeline: cancelledTimeline,
      activeIndex: 1,
    };
  }

  if (status === "Pending") {
    return {
      timeline: inProgressTimeline,
      activeIndex: 0,
    };
  }

  if (status === "Confirmed") {
    return {
      timeline: inProgressTimeline,
      activeIndex: 1,
    };
  }

  if (status === "Preparing") {
    return {
      timeline: inProgressTimeline,
      activeIndex: 2,
    };
  }

  if (status === "On the way") {
    return {
      timeline: inProgressTimeline,
      activeIndex: 3,
    };
  }

  return {
    timeline: inProgressTimeline,
    activeIndex: 4,
  };
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
    const quantity = Math.max(1, toNumber(item.quantity, 1));
    const unitPrice = toNumber(item.unitPrice ?? item.price ?? item.meal?.price, 0);
    const lineTotal = toNumber(item.totalPrice, unitPrice * quantity);

    return {
      name: item.meal?.name || item.meal?.title || item.mealName || item.name || item.title || `Item ${index + 1}`,
      image: item.meal?.image || item.image || "/categories/pizza.svg",
      quantity,
      lineTotal,
    };
  });
}

function normalizeOrder(rawOrder: RawOrder, fallbackId: string): UiOrder {
  const items = toOrderItems(rawOrder);

  const subtotalFromItems = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const subtotal = toNumber(rawOrder.pricing?.subtotal ?? rawOrder.subtotal, subtotalFromItems);
  const deliveryFee = toNumber(rawOrder.pricing?.deliveryFee ?? rawOrder.deliveryFee, 0);
  const tax = toNumber(rawOrder.pricing?.tax ?? rawOrder.tax, 0);
  const total = toNumber(rawOrder.pricing?.total ?? rawOrder.totalAmount ?? rawOrder.total, subtotal + deliveryFee + tax);
  const adjustedTax = tax || Math.max(0, total - subtotal - deliveryFee);

  return {
    id: rawOrder.id || rawOrder.orderId || rawOrder._id || fallbackId,
    date: toOrderDate(rawOrder),
    status: normalizeStatus(rawOrder.orderStatus ?? rawOrder.status),
    address: toOrderAddress(rawOrder),
    customerName: rawOrder.deliveryAddress?.fullName || "N/A",
    customerPhone: rawOrder.deliveryAddress?.phoneNumber || "N/A",
    userEmail: rawOrder.userEmail || "N/A",
    paymentMethod: rawOrder.paymentMethod || "N/A",
    paymentStatus: rawOrder.paymentStatus || "N/A",
    items,
    subtotal,
    deliveryFee,
    tax: adjustedTax,
    total,
  };
}

export default async function CustomerOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = (await getCustomerOrderById(id)) as OrderDetailsApiResponse;
  const rawOrder: RawOrder | undefined = response?.data;

  if (!rawOrder) {
    notFound();
  }

  const order = normalizeOrder(rawOrder, id);
  const tracker = getTrackerConfig(order.status);

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
        <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Order Details</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{order.id}</h1>
        <span className={`mt-4 inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(order.status)}`}>
          <BadgeCheck className="h-4 w-4" />
          {order.status}
        </span>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Order Date</p>
                <p className="mt-2 inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                  <CalendarDays className="h-4 w-4 text-orange-500" />
                  {order.date}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Delivery Address</p>
                <p className="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <MapPin className="mt-0.5 h-4 w-4 flex-none text-orange-500" />
                  {order.address}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Customer</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{order.customerName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.customerPhone}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{order.userEmail}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Payment</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{order.paymentMethod.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status: {order.paymentStatus.replaceAll("_", " ")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Items</h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <article key={`${item.name}-${item.quantity}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">${item.lineTotal.toFixed(2)}</p>
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
                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Delivery Fee</span>
                <span className="font-semibold">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Tax</span>
                <span className="font-semibold">${order.tax.toFixed(2)}</span>
              </div>
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Status Tracker</h2>
            <div className="mt-5 space-y-4">
              {tracker.timeline.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= tracker.activeIndex;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${isActive ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-semibold ${isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.status === "Delivered" && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <h2 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">Your order has been delivered</h2>
              <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">Leave a review to help others and share your experience.</p>
              <Button className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Leave Review</Button>
            </div>
          )}
        </aside>
      </section>
    </section>
  );
}
