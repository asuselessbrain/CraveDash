
import Image from "next/image";
import Link from "next/link";

import heroImage from "@/assets/images/hero.jpg";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="relative isolate min-h-[68vh] overflow-hidden lg:min-h-[72vh]">
      <div className="absolute inset-0 -z-20">
        <Image
          src={heroImage}
          alt="Delicious food spread"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/80 via-slate-950/68 to-slate-900/38"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/18" aria-hidden="true" />

      <div className="mx-auto flex min-h-[68vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[72vh] lg:px-8">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Discover &amp; Order</span>
            <span className="block text-orange-500">Delicious Meals</span>
          </h1>

          <p className="mt-4 max-w-147.5 text-xl leading-relaxed text-slate-100/95">
            Fresh food from the best local restaurants, delivered to your door.
            Cash on delivery.
          </p>

          <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search for meals..."
                className="h-12 rounded-xl border-0 bg-white px-4 pl-11 text-base text-slate-900 placeholder:text-slate-500"
              />
            </div>

            <Link href="/browse" className="shrink-0">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-orange-500 px-8 text-base font-semibold text-white shadow-lg shadow-orange-600/30 hover:bg-orange-400"
              >
                Browse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
