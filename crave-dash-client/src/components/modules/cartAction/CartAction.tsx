"use client"
import { Button } from "@/components/ui/button";
import { clearCart, decreaseCartItemQuantity, increaseCartItemQuantity, removeItemFromCart } from "@/services/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// type cartACtionProps = {
//     cartItems: {

//     }
// }

type CartMeal = {
    name: string;
    image: string;
    provider?: string;
    price: number | string;
};

type CartLineItem = {
    id: string;
    quantity: number;
    mealId: string;
    meal: CartMeal;
};

type CartItemsPayload = {
    data?: {
        items?: CartLineItem[];
        meta?: {
            subTotal?: number | string;
            deliveryCharge?: number | string;
            total?: number | string;
        };
    };
};

export default function CartAction({ cartItems }: { cartItems: CartItemsPayload }) {
    const items = cartItems?.data?.items ?? [];
    const isEmpty = items.length === 0;
    const subTotal = isEmpty ? 0 : Number(cartItems?.data?.meta?.subTotal ?? 0);
    const deliveryCharge = isEmpty ? 0 : Number(cartItems?.data?.meta?.deliveryCharge ?? 0);
    const total = isEmpty ? 0 : Number(cartItems?.data?.meta?.total ?? 0);

    const handleClearCart = async () => {
        const res = await clearCart()

        if (res.success) {
            toast.success(res.message || "Cart cleared!");
        }
        else {
            toast.error(res.errorMessage || "Failed to clear cart. Please try again.");
        }
    };

    const removeItem = async (itemId: string, mealId: string) => {
        const res = await removeItemFromCart(itemId, mealId)

        if (res.success) {
            toast.success(res.message || "Item removed from cart!");
        }
        else {
            toast.error(res.errorMessage || "Failed to remove item from cart. Please try again.");
        }
    }

    const updateQuantity = async (itemId: string, operation: "inc" | "dec") => {

        const res = await (operation === "inc" ? increaseCartItemQuantity(itemId) : decreaseCartItemQuantity(itemId))

        if (res.success) {
            toast.success(res.message || "Item quantity updated!");
        }

        else {
            toast.error(res.errorMessage || "Failed to update item quantity. Please try again.");
        }
    }
    return (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Cart Items ({items.length})</h2>
                    {!isEmpty && (
                        <button
                            type="button"
                            onClick={() => handleClearCart()}
                            className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-300"
                        >
                            Clear cart
                        </button>
                    )}
                </div>

                {isEmpty ? (
                    <div className="rounded-2xl border border-dashed border-orange-300/70 bg-orange-50/60 p-8 text-center dark:border-orange-400/20 dark:bg-orange-500/10">
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">Your cart is empty</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Add meals to your cart to continue.
                        </p>
                        <Button asChild className="mt-5 h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Link href="/meals">Browse Meals</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <article
                                key={item.id}
                                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative h-18 w-18 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                        <Image src={item.meal.image} alt={item.meal.name} fill sizes="72px" className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.meal.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.meal.provider}</p>
                                        <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-300">${item.meal.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, "dec")}
                                            className="px-3 py-1.5 text-slate-700 dark:text-slate-200"
                                            aria-label={`Decrease quantity of ${item.meal.name}`}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-2 text-sm font-bold text-slate-900 dark:text-slate-100">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, "inc")}
                                            className="px-3 py-1.5 text-slate-700 dark:text-slate-200"
                                            aria-label={`Increase quantity of ${item.meal.name}`}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id, item.mealId)}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500/40 dark:hover:text-rose-300"
                                        aria-label={`Remove ${item.meal.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <aside className="h-fit rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Order Summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Subtotal</span>
                        <span className="font-semibold">${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">${deliveryCharge.toFixed(2)}</span>
                    </div>
                    {/* <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
								<span>Tax (5%)</span>
								<span className="font-semibold">${tax.toFixed(2)}</span>
							</div> */}
                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-slate-100">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {isEmpty ? (
                    <Button
                        disabled
                        className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white"
                    >
                        Proceed to Checkout
                    </Button>
                ) : (
                    <Link href="/checkout">
                        <Button className="mt-6 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            Proceed to Checkout
                        </Button>
                    </Link>
                )}

                <Button asChild variant="outline" className="mt-3 h-11 w-full rounded-xl">
                    <Link href="/meals">Add More Meals</Link>
                </Button>
            </aside>
        </section>
    )
}
