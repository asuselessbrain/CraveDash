"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";

type Deal = {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
};

const flashDeals: Deal[] = [
  {
    id: 1,
    name: "Smoky Pepperoni Pizza",
    image: "/categories/pizza.svg",
    originalPrice: 15.99,
    discountedPrice: 10.99,
    discountPercent: 31,
  },
  {
    id: 2,
    name: "Double Cheese Burger",
    image: "/categories/burger.svg",
    originalPrice: 12.49,
    discountedPrice: 8.49,
    discountPercent: 32,
  },
  {
    id: 3,
    name: "Chef Special Biryani",
    image: "/categories/biryani.svg",
    originalPrice: 13.99,
    discountedPrice: 9.99,
    discountPercent: 29,
  },
  {
    id: 4,
    name: "Hot Garlic Noodles",
    image: "/categories/chinese.svg",
    originalPrice: 11.49,
    discountedPrice: 7.99,
    discountPercent: 30,
  },
  {
    id: 5,
    name: "Chocolate Dessert Box",
    image: "/categories/desserts.svg",
    originalPrice: 9.99,
    discountedPrice: 6.49,
    discountPercent: 35,
  },
  {
    id: 6,
    name: "Summer Fruit Cooler",
    image: "/categories/drinks.svg",
    originalPrice: 7.49,
    discountedPrice: 4.99,
    discountPercent: 33,
  },
];

function getDealDeadline() {
  const now = new Date();
  const deadline = new Date(now);

  deadline.setHours(23, 59, 59, 999);

  return deadline;
}

function formatTime(value: number) {
  return String(value).padStart(2, "0");
}

export default function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const dealDeadline = useMemo(() => getDealDeadline(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = Math.max(dealDeadline.getTime() - now, 0);

      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [dealDeadline]);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
              ⚡ Flash Deals - Limited Time Only!
            </h2>

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/70 bg-white/85 px-3 py-2 text-sm font-semibold text-orange-700 backdrop-blur-sm dark:border-orange-500/40 dark:bg-slate-900/80 dark:text-orange-300">
              <Timer className="h-4 w-4" />
              <span>
                {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashDeals.map((deal) => (
              <article
                key={deal.id}
                className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 dark:border-slate-700 dark:bg-slate-900/85"
              >
                <span className="absolute top-3 left-3 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                  -{deal.discountPercent}% OFF
                </span>

                <div className="relative h-40 overflow-hidden rounded-xl">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{deal.name}</h3>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-sm text-slate-500 line-through dark:text-slate-400">${deal.originalPrice.toFixed(2)}</span>
                  <span className="text-lg font-extrabold text-orange-600 dark:text-orange-300">${deal.discountedPrice.toFixed(2)}</span>
                </div>

                <Button className="mt-4 h-10 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-400">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
