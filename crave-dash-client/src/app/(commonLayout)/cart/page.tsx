import { getCartItems } from "@/services/cart";
import CartAction from "@/components/modules/cartAction/CartAction";


export default async function CartPage() {

	const cartItems = await getCartItems()

	return (
		<main className="food-landing-bg">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<header className="mb-6">
					<p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Shopping Cart</p>
					<h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Review Your Order</h1>
				</header>

				<CartAction cartItems={cartItems} />
			</div>
		</main>
	);
}
