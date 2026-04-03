import Link from "next/link";

const categories = [
  "pizza",
  "burger",
  "biryani",
  "chinese",
  "desserts",
  "drinks",
  "bbq",
  "steak",
] as const;

const cuisines = ["italian", "chinese", "indian", "japanese", "mexican", "thai", "korean", "mediterranean"] as const;

type Category = (typeof categories)[number];
type Cuisine = (typeof cuisines)[number];

type Meal = {
  id: number;
  name: string;
  category: Category;
  cuisine: Cuisine;
  price: number;
  rating: number;
};

const meals: Meal[] = [
  { id: 1, name: "Margherita Pizza", category: "pizza", cuisine: "italian", price: 8.99, rating: 4.6 },
  { id: 2, name: "Pepperoni Pizza", category: "pizza", cuisine: "italian", price: 10.99, rating: 4.7 },
  { id: 3, name: "Classic Beef Burger", category: "burger", cuisine: "mexican", price: 7.99, rating: 4.5 },
  { id: 4, name: "Crispy Chicken Burger", category: "burger", cuisine: "korean", price: 8.49, rating: 4.4 },
  { id: 5, name: "Kacchi Biryani", category: "biryani", cuisine: "indian", price: 9.99, rating: 4.8 },
  { id: 6, name: "Chicken Biryani", category: "biryani", cuisine: "indian", price: 8.99, rating: 4.6 },
  { id: 7, name: "Szechuan Chicken", category: "chinese", cuisine: "chinese", price: 10.49, rating: 4.3 },
  { id: 8, name: "Chicken Chow Mein", category: "chinese", cuisine: "chinese", price: 9.49, rating: 4.4 },
  { id: 9, name: "Chocolate Lava Cake", category: "desserts", cuisine: "italian", price: 5.99, rating: 4.7 },
  { id: 10, name: "Strawberry Cheesecake", category: "desserts", cuisine: "italian", price: 6.49, rating: 4.8 },
  { id: 11, name: "Mango Smoothie", category: "drinks", cuisine: "thai", price: 4.49, rating: 4.5 },
  { id: 12, name: "Cold Coffee", category: "drinks", cuisine: "indian", price: 3.99, rating: 4.4 },
  { id: 13, name: "Smoked BBQ Wings", category: "bbq", cuisine: "korean", price: 11.99, rating: 4.6 },
  { id: 14, name: "Grilled Ribeye", category: "steak", cuisine: "mediterranean", price: 16.99, rating: 4.7 },
  { id: 15, name: "Chicken Teriyaki", category: "chinese", cuisine: "japanese", price: 12.49, rating: 4.6 },
  { id: 16, name: "Beef Ramen", category: "chinese", cuisine: "japanese", price: 11.99, rating: 4.5 },
  { id: 17, name: "Loaded Chicken Tacos", category: "burger", cuisine: "mexican", price: 9.99, rating: 4.6 },
  { id: 18, name: "Spicy Burrito Bowl", category: "biryani", cuisine: "mexican", price: 10.49, rating: 4.5 },
  { id: 19, name: "Pad Thai Noodles", category: "chinese", cuisine: "thai", price: 10.99, rating: 4.7 },
  { id: 20, name: "Tom Yum Soup", category: "chinese", cuisine: "thai", price: 8.99, rating: 4.4 },
  { id: 21, name: "Bibimbap Bowl", category: "biryani", cuisine: "korean", price: 12.99, rating: 4.7 },
  { id: 22, name: "Kimchi Fried Rice", category: "biryani", cuisine: "korean", price: 10.99, rating: 4.6 },
  { id: 23, name: "Chicken Shawarma Plate", category: "bbq", cuisine: "mediterranean", price: 11.99, rating: 4.8 },
  { id: 24, name: "Falafel Wrap", category: "burger", cuisine: "mediterranean", price: 8.49, rating: 4.5 },
];

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type BrowsePageProps = {
  searchParams?: {
    category?: string;
    cuisine?: string;
  };
};

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  const selectedCategory = searchParams?.category?.toLowerCase();
  const selectedCuisine = searchParams?.cuisine?.toLowerCase();
  const isValidCategory = selectedCategory && categories.includes(selectedCategory as Category);
  const isValidCuisine = selectedCuisine && cuisines.includes(selectedCuisine as Cuisine);

  const filteredMeals = isValidCategory
    ? meals.filter((meal) => meal.category === selectedCategory)
    : isValidCuisine
      ? meals.filter((meal) => meal.cuisine === selectedCuisine)
      : meals;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="text-sm font-semibold tracking-[0.12em] text-orange-600 uppercase dark:text-orange-300">
          Explore Meals
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {isValidCategory ? `${toTitleCase(selectedCategory)} Meals` : isValidCuisine ? `${toTitleCase(selectedCuisine)} Menu` : "All Meals"}
        </h1>
      </header>

      <div className="mb-7 flex flex-wrap gap-3">
        <Link
          href="/browse"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !isValidCategory
              ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/60 dark:bg-orange-500/15 dark:text-orange-200"
              : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          }`}
        >
          All
        </Link>

        {categories.map((category) => (
          <Link
            key={category}
            href={`/browse?category=${category}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category
                ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/60 dark:bg-orange-500/15 dark:text-orange-200"
                : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {toTitleCase(category)}
          </Link>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMeals.map((meal) => (
          <article
            key={meal.id}
            className="rounded-2xl border border-slate-200/75 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              {toTitleCase(meal.category)}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{meal.name}</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-orange-600 dark:text-orange-300">${meal.price.toFixed(2)}</span>
              <span className="text-slate-600 dark:text-slate-300">⭐ {meal.rating}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
