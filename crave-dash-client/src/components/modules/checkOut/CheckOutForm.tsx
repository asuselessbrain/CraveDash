"use client";

import { CheckCircle2, Clock3, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { confirmStripeCheckoutSession, createOrder, createStripeCheckoutSession } from "@/services/order";

type CheckoutMeal = {
    id?: string;
    name: string;
    price: number | string;
};

type CheckoutItem = {
    id: string;
    mealId?: string;
    quantity: number;
    meal: CheckoutMeal;
};

type CheckOutFormProps = {
    orderItems: CheckoutItem[];
    isEmpty: boolean;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    initialAddress?: Partial<CheckoutFormState>;
};

type CheckoutFormState = {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    area: string;
    deliveryInstructions: string;
};

type PaymentMode = "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";

export default function CheckOutForm({
    orderItems,
    isEmpty,
    subtotal,
    deliveryFee,
    tax,
    total,
    initialAddress,
}: CheckOutFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmingStripe, setIsConfirmingStripe] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMode>("CASH_ON_DELIVERY");
    const [form, setForm] = useState<CheckoutFormState>({
        fullName: initialAddress?.fullName ?? "",
        phoneNumber: initialAddress?.phoneNumber ?? "",
        streetAddress: initialAddress?.streetAddress ?? "",
        city: initialAddress?.city ?? "Dhaka",
        area: initialAddress?.area ?? "",
        deliveryInstructions: initialAddress?.deliveryInstructions ?? "",
    });

    const handleInputChange = (key: keyof CheckoutFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const deliveryAddress = useMemo(() => ({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        streetAddress: form.streetAddress.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        deliveryInstructions: form.deliveryInstructions.trim(),
    }), [form]);

    useEffect(() => {
        const payment = searchParams.get("payment");
        const sessionId = searchParams.get("session_id");

        if (payment !== "success" || !sessionId) {
            return;
        }

        const confirmPayment = async () => {
            setIsConfirmingStripe(true);
            const response = await confirmStripeCheckoutSession(sessionId);

            if (response?.success) {
                toast.success("Payment successful and order confirmed!");
                router.replace("/customer/orders");
                return;
            }

            toast.error(response?.message || "Payment verification failed. Please contact support.");
            setIsConfirmingStripe(false);
        };

        void confirmPayment();
    }, [router, searchParams]);

    useEffect(() => {
        if (searchParams.get("payment") === "cancelled") {
            toast.error("Stripe payment was cancelled. You can try again.");
        }
    }, [searchParams]);

    const handleCheckoutSubmit = async () => {
        if (isEmpty) {
            toast.error("Your cart is empty.");
            return;
        }

        if (!form.fullName.trim() || !form.phoneNumber.trim() || !form.streetAddress.trim() || !form.city.trim() || !form.area.trim()) {
            toast.error("Please fill in all required delivery fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (paymentMethod === "ONLINE_PAYMENT") {
                const stripeSession = await createStripeCheckoutSession({
                    deliveryAddress,
                });

                const checkoutUrl = stripeSession?.data?.checkoutUrl as string | undefined;
                if (!stripeSession?.success || !checkoutUrl) {
                    toast.error(stripeSession?.message || "Failed to start online payment.");
                    return;
                }

                window.location.href = checkoutUrl;
                return;
            }

            const payload = {
                items: orderItems.map((item) => ({
                    mealId: item.mealId ?? item.meal.id,
                    quantity: item.quantity,
                })),
                paymentMethod,
                deliveryAddress,
                pricing: {
                    subtotal,
                    deliveryFee,
                    tax,
                    total,
                },
            };

            const res = await createOrder(payload);
            if (res.success) {
                toast.success("Order placed successfully!");
                router.push("/customer/orders");
            } else {
                toast.error(res.message || "Failed to place order. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
                <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Delivery Address</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enter the address where you want the order delivered.</p>
                        </div>
                    </div>

                    <form className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <Input
                                placeholder="Your name"
                                className="h-11 rounded-xl bg-white dark:bg-slate-950"
                                value={form.fullName}
                                onChange={(event) => handleInputChange("fullName", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                            <Input
                                placeholder="01XXXXXXXXX"
                                className="h-11 rounded-xl bg-white dark:bg-slate-950"
                                value={form.phoneNumber}
                                onChange={(event) => handleInputChange("phoneNumber", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Street Address</label>
                            <Input
                                placeholder="House no., road, area"
                                className="h-11 rounded-xl bg-white dark:bg-slate-950"
                                value={form.streetAddress}
                                onChange={(event) => handleInputChange("streetAddress", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">City</label>
                            <Input
                                className="h-11 rounded-xl bg-white dark:bg-slate-950"
                                value={form.city}
                                onChange={(event) => handleInputChange("city", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Area</label>
                            <Input
                                placeholder="Dhanmondi, Banani..."
                                className="h-11 rounded-xl bg-white dark:bg-slate-950"
                                value={form.area}
                                onChange={(event) => handleInputChange("area", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Instructions</label>
                            <textarea
                                rows={4}
                                placeholder="Any note for the rider"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                value={form.deliveryInstructions}
                                onChange={(event) => handleInputChange("deliveryInstructions", event.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                            <PackageCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Payment Method</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Choose how you want to pay for this order.</p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                            className={`rounded-2xl border p-4 text-left transition ${
                                paymentMethod === "CASH_ON_DELIVERY"
                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                            }`}
                            disabled={isSubmitting || isConfirmingStripe}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Cash on Delivery</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Pay rider at your doorstep</p>
                                </div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("ONLINE_PAYMENT")}
                            className={`rounded-2xl border p-4 text-left transition ${
                                paymentMethod === "ONLINE_PAYMENT"
                                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
                                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                            }`}
                            disabled={isSubmitting || isConfirmingStripe}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Stripe Online Payment</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Card, Apple Pay, Google Pay</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {paymentMethod === "ONLINE_PAYMENT" && (
                        <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                    <Image
                                        src="/app/cravedash-logo-dark.svg"
                                        alt="CraveDash"
                                        width={28}
                                        height={28}
                                        className="h-7 w-7"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">CraveDash Secure Payment</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Powered by Stripe • Your payment details are encrypted</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                            <Clock3 className="mb-2 h-4 w-4 text-orange-500" />
                            Estimated 25-35 min
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                            <Truck className="mb-2 h-4 w-4 text-orange-500" />
                            Live delivery tracking
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                            <CheckCircle2 className="mb-2 h-4 w-4 text-orange-500" />
                            Order confirmation SMS
                        </div>
                    </div>
                </div>
            </div>

            <aside className="h-fit rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>

                {isEmpty ? (
                    <div className="mt-5 rounded-2xl border border-dashed border-orange-300/70 bg-orange-50/60 p-5 text-center dark:border-orange-400/20 dark:bg-orange-500/10">
                        <p className="font-bold text-slate-900 dark:text-slate-100">Your cart is empty.</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add meals first to continue checkout.</p>
                        <Button asChild className="mt-4 h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Link href="/meals">Browse Meals</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="mt-5 space-y-4">
                        {orderItems.map((item) => {
                            const itemPrice = Number(item.meal?.price ?? 0);
                            return (
                                <div key={item.id} className="flex items-start justify-between gap-3 border-b border-dashed border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item.meal?.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">৳{(itemPrice * item.quantity).toFixed(2)}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Subtotal</span>
                        <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Tax</span>
                        <span className="font-semibold">৳{tax.toFixed(2)}</span>
                    </div>
                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-slate-100">
                        <span>Total</span>
                        <span>৳{total.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    disabled={isEmpty || isSubmitting || isConfirmingStripe}
                    className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isConfirmingStripe
                        ? "Confirming Payment..."
                        : isSubmitting
                            ? paymentMethod === "ONLINE_PAYMENT"
                                ? "Redirecting to Stripe..."
                                : "Placing Order..."
                            : paymentMethod === "ONLINE_PAYMENT"
                                ? "Pay with Stripe"
                                : "Place Order"}
                </Button>

                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                    By placing your order, you agree to our delivery terms and policies.
                </p>
            </aside>
        </section>
    )
}
