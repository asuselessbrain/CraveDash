import { getCartItems } from "@/services/cart";
import CheckOutForm from "@/components/modules/checkOut/CheckOutForm";

type CartMeal = {
    name: string;
    price: number | string;
};

type CartItem = {
    id: string;
    quantity: number;
    meal: CartMeal;
};

type CartResponse = {
    data?: {
        items?: CartItem[];
        meta?: {
            subTotal?: number | string;
            deliveryCharge?: number | string;
            tax?: number | string;
            total?: number | string;
        };
    };
};

export default async function CheckoutPage() {
    const cartResponse = (await getCartItems()) as CartResponse;

    const orderItems = cartResponse?.data?.items ?? [];
    const isEmpty = orderItems.length === 0;

    const subtotalFromItems = orderItems.reduce((sum, item) => {
        const price = Number(item.meal?.price ?? 0);
        return sum + price * item.quantity;
    }, 0);

    const subtotal = isEmpty
        ? 0
        : subtotalFromItems > 0
            ? subtotalFromItems
            : Number(cartResponse?.data?.meta?.subTotal ?? 0);

    const deliveryFee = isEmpty ? 0 : Number(cartResponse?.data?.meta?.deliveryCharge ?? 0);
    const tax = isEmpty ? 0 : Number(cartResponse?.data?.meta?.tax ?? 0);
    const total = isEmpty
        ? 0
        : Number(cartResponse?.data?.meta?.total ?? subtotal + deliveryFee + tax);

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Checkout</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Complete Your Order</h1>
                </header>

                <CheckOutForm
                    orderItems={orderItems}
                    isEmpty={isEmpty}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    tax={tax}
                    total={total}
                />
            </div>
        </main>
    );
}
