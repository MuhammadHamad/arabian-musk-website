"use client";

import { PlusIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import type { Scent } from "@/lib/scent";

/** Opens the size sheet for a scent: a square on phones, a bar on hover elsewhere. */
export function QuickAdd({ scent }: { scent: Scent }) {
  const { openPicker } = useOrder();
  return (
    <button
      type="button"
      onClick={() => openPicker(scent)}
      aria-label={`Choose a size of ${scent.name}`}
      className="caps absolute bottom-0 right-0 grid size-10 place-items-center bg-paper/95 text-ink transition duration-500 hover:bg-ink hover:text-paper md:inset-x-0 md:size-auto md:translate-y-2 md:py-3.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
    >
      <PlusIcon size={16} className="md:hidden" />
      <span className="hidden md:inline">Choose size</span>
    </button>
  );
}
