import { getCartItems } from "@/services/cart";
import CartAction from "@/components/modules/cartAction/CartAction";


export default async function CartPage() {

	const cartItems = await getCartItems()

	// const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

	// const subtotal = useMemo(() => {
	// 	return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	// }, [cartItems]);

	// const deliveryFee = cartItems.length > 0 ? 1.5 : 0;
	// const tax = subtotal * 0.05;
	// const total = subtotal + deliveryFee + tax;

	// const updateQuantity = (id: string, direction: "inc" | "dec") => {
	// 	setCartItems((prev) =>
	// 		prev
	// 			.map((item) => {
	// 				if (item.id !== id) return item;
	// 				const nextQuantity = direction === "inc" ? item.quantity + 1 : item.quantity - 1;
	// 				return { ...item, quantity: nextQuantity };
	// 			})
	// 			.filter((item) => item.quantity > 0)
	// 	);
	// };

	// const removeItem = (id: string) => {
	// 	setCartItems((prev) => prev.filter((item) => item.id !== id));
	// };

	

	// if (cartItems.length === 0) {
	// 	return (
	// 		<main className="food-landing-bg">
	// 			<div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
	// 				<div className="w-full rounded-3xl border border-orange-200/70 bg-white/90 p-8 text-center shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-12">
	// 					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
	// 						<ShoppingBag className="h-8 w-8" />
	// 					</div>
	// 					<h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Your cart is empty</h1>
	// 					<p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
	// 						Looks like you have not added any meals yet. Explore delicious options and build your order.
	// 					</p>
	// 					<Button asChild className="mt-6 h-11 rounded-xl bg-orange-500 px-6 text-white hover:bg-orange-400">
	// 						<Link href="/meals">Browse Meals</Link>
	// 					</Button>
	// 				</div>
	// 			</div>
	// 		</main>
	// 	);
	// }

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
