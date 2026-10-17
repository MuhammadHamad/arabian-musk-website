"use client";

import { useOrder } from "@/components/order-provider";
import type { Scent } from "@/lib/scent";

/** Opens the size sheet for a scent. */
export function QuickAdd({ scent }: { scent: Scent }) {
  const { openPicker } = useOrder();
  return (
    <button
      type="button"
      onClick={() => openPicker(scent)}
      aria-label={`Select options for ${scent.name}`}
      className="btn btn-amber mt-4 w-full whitespace-nowrap !px-3 !py-3 !text-[11.5px] !tracking-[2px] lg:w-auto lg:!px-6 lg:!text-[12.5px] lg:!tracking-[3px]"
    >
      Select options
    </button>
  );
}
