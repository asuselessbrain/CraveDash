import { Globe2, ShieldCheck, Sparkles, Truck, Users, UtensilsCrossed, Clock3, HeartHandshake } from "lucide-react";

const values = [
  {
    title: "Fresh & Fast",
    description: "We partner with trusted providers to deliver fresh meals quickly, without compromising quality.",
    icon: Truck,
  },
  {
    title: "Transparent Service",
    description: "Clear pricing, real-time updates, and reliable support for every order.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Discovery",
    description: "Find meals by cuisine, category, and preference with a clean and fast experience.",
    icon: Sparkles,
  },
  {
    title: "Local Impact",
    description: "We help local food businesses grow while giving customers more quality choices.",
    icon: Globe2,
  },
];

const highlights = [
  { label: "Meals Delivered", value: "50K+", icon: UtensilsCrossed },
  { label: "Active Customers", value: "12K+", icon: Users },
  { label: "Avg Delivery Time", value: "28 min", icon: Clock3 },
  { label: "Partner Providers", value: "500+", icon: HeartHandshake },
];

export default function AboutPage() {
  return (
    <main className="food-landing-bg pb-16 pt-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200/70 bg-white/90 p-7 shadow-sm sm:p-10 dark:border-orange-400/20 dark:bg-slate-900/90">
          <div className="pointer-events-none absolute -top-10 -right-12 h-40 w-40 rounded-full bg-orange-300/20 blur-2xl dark:bg-orange-500/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-amber-200/30 blur-2xl dark:bg-amber-400/10" />

          <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">About CraveDash</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            Built to Make Food Ordering Effortless
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            CraveDash connects customers with great local providers through a fast, trustworthy platform.
            From discovering meals to checkout and delivery tracking, we focus on smooth interactions and
            delightful user experience.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">{item.label}</p>
                    <Icon className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 sm:p-7">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Our Story</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              CraveDash started with one simple idea: ordering food should feel as easy and enjoyable as eating it.
              We noticed users were spending too much time comparing menus, waiting for confirmations, and guessing
              delivery updates. So we built a single platform that keeps discovery, ordering, and tracking clean and fast.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Today, our focus is still the same: better experience for customers and better visibility for local providers.
              Every new feature is designed around speed, clarity, and trust.
            </p>
          </article>

          <article className="rounded-3xl border border-orange-200/70 bg-linear-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-400/20 dark:from-slate-900 dark:to-slate-800 sm:p-7">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">What We Promise</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="rounded-xl border border-orange-200/70 bg-white/85 px-3 py-2 dark:border-orange-400/20 dark:bg-slate-900/70">Reliable and transparent ordering flow</li>
              <li className="rounded-xl border border-orange-200/70 bg-white/85 px-3 py-2 dark:border-orange-400/20 dark:bg-slate-900/70">Accurate meal and pricing details</li>
              <li className="rounded-xl border border-orange-200/70 bg-white/85 px-3 py-2 dark:border-orange-400/20 dark:bg-slate-900/70">Fast issue resolution through support</li>
              <li className="rounded-xl border border-orange-200/70 bg-white/85 px-3 py-2 dark:border-orange-400/20 dark:bg-slate-900/70">Sustained growth for local partners</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/90"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-slate-100">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
