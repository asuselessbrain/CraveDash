"use client";

import { useState } from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

type ChartPoint = {
  label: string;
  value: number;
};

type AdminChartsPanelProps = {
  weeklyOrders: ChartPoint[];
  weeklyRevenue: ChartPoint[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

function HoverBar({
  label,
  value,
  max,
  tone,
  formatter,
}: {
  label: string;
  value: number;
  max: number;
  tone: "orange" | "emerald";
  formatter?: (value: number) => string;
}) {
  const safeMax = max > 0 ? max : 1;
  const height = Math.max((value / safeMax) * 180, 12);
  const gradientClass =
    tone === "emerald"
      ? "from-emerald-500 to-teal-300 shadow-emerald-500/20"
      : "from-orange-500 to-amber-300 shadow-orange-500/20";

  return (
    <div className="group flex min-w-0 flex-1 flex-col items-center gap-2">
      <div className="relative flex h-44 items-end">
        <div
          className={`w-7 rounded-t-xl bg-linear-to-t ${gradientClass} shadow-lg transition-all duration-200 group-hover:-translate-y-1 sm:w-8 md:w-9 lg:w-10`}
          style={{ height }}
        />
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 shadow transition group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
          {label}: {formatter ? formatter(value) : value.toLocaleString()}
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function RevenuePieChart({ data }: { data: ChartPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const size = 210;
  const radius = 68;
  const baseStroke = 24;
  const hoverStroke = 30;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = ["#10b981", "#14b8a6", "#22c55e", "#06b6d4", "#34d399", "#0ea5e9", "#84cc16"];

  const slices = data.reduce<{
    runningFraction: number;
    items: Array<ChartPoint & { fraction: number; dash: number; offset: number; color: string }>;
  }>(
    (acc, item, index) => {
      const value = Math.max(0, item.value);
      const fraction = total > 0 ? value / total : 0;
      const dash = circumference * fraction;

      const nextSlice = {
        ...item,
        fraction,
        dash,
        offset: circumference * (1 - acc.runningFraction),
        color: colors[index % colors.length],
      };

      return {
        runningFraction: acc.runningFraction + fraction,
        items: [...acc.items, nextSlice],
      };
    },
    { runningFraction: 0, items: [] },
  ).items;

  const activeIndex = hoveredIndex ?? (slices.length ? 0 : null);
  const activeSlice = activeIndex !== null ? slices[activeIndex] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
      <div className="mb-3 flex items-center gap-2">
        <PieChart className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
          Revenue This Week
        </h3>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative h-48 w-48 shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-200/80 dark:text-slate-700/80"
              strokeWidth={baseStroke}
            />

            {slices.map((slice, index) => {
              const isActive = hoveredIndex === index;
              return (
                <circle
                  key={`rev-slice-${slice.label}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isActive ? hoverStroke : baseStroke}
                  strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
                  strokeDashoffset={slice.offset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  style={{ opacity: hoveredIndex === null || isActive ? 1 : 0.45 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <title>{`${slice.label}: ${formatCurrency(slice.value)} (${(slice.fraction * 100).toFixed(1)}%)`}</title>
                </circle>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {activeSlice ? activeSlice.label : "Total Revenue"}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {activeSlice ? formatCurrency(activeSlice.value) : formatCurrency(total)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
              {activeSlice ? `${(activeSlice.fraction * 100).toFixed(1)}%` : "100%"}
            </span>
          </div>
        </div>

        <div className="grid flex-1 gap-2">
          {slices.map((slice, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={`rev-legend-${slice.label}`}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                  isActive ? "bg-emerald-50 dark:bg-emerald-500/10" : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{slice.label}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(slice.value)}</p>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{(slice.fraction * 100).toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminChartsPanel({
  weeklyOrders,
  weeklyRevenue,
}: AdminChartsPanelProps) {
  const maxOrders = Math.max(1, ...weeklyOrders.map((point) => point.value));

  return (
    <section className="rounded-3xl border border-orange-200/70 bg-linear-to-br from-white via-white to-orange-50/40 p-5 shadow-sm dark:border-orange-400/20 dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-950 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Performance Analytics</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Professional chart suite with hover insights for daily trend analysis.
          </p>
        </div>
        <BarChart3 className="h-5 w-5 text-orange-500" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-orange-500/40">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Orders This Week
            </h3>
          </div>
          <div className="mt-4 flex items-end gap-2 sm:gap-3 md:gap-4">
            {weeklyOrders.map((point) => (
              <HoverBar
                key={`orders-${point.label}`}
                label={point.label}
                value={point.value}
                max={maxOrders}
                tone="orange"
              />
            ))}
          </div>
        </div>

        <RevenuePieChart data={weeklyRevenue} />
      </div>
    </section>
  );
}
