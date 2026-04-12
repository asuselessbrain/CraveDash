"use client";

import { useRef } from "react";

type ProviderNextStatus = "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderStatusUpdaterProps = {
  orderId: string;
  options: ProviderNextStatus[];
  action: (formData: FormData) => Promise<void>;
  formatStatus: (status: ProviderNextStatus) => string;
};

export default function OrderStatusUpdater({ orderId, options, action, formatStatus }: OrderStatusUpdaterProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="flex items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="orderStatus"
        defaultValue={options[0]}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
      >
        {options.map((nextStatus) => (
          <option key={nextStatus} value={nextStatus}>
            {formatStatus(nextStatus)}
          </option>
        ))}
      </select>
    </form>
  );
}
