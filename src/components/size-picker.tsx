"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { formatRs, sizeOf, type Scent, type SizeKey } from "@/lib/scent";

const OPTIONS: { key: SizeKey; label: string }[] = [
  { key: "perfume10", label: "10 ml" },
  { key: "perfume30", label: "30 ml" },
  { key: "perfume50", label: "50 ml" },
  { key: "perfume100", label: "100 ml" },
  { key: "attar12", label: "12 ml Attar" },
];

/** A size box, the price of the chosen size, quantity and an amber add button. */
export function SizePicker({ scent, onAdded }: { scent: Scent; onAdded?: () => void }) {
  const { add } = useOrder();
  const [size, setSize] = useState<SizeKey>("perfume30");
  const [qty, setQty] = useState(1);
  const attar = sizeOf(size).kind === "Attar";

  return (
    <div>
      <div className="border border-line">
        <p className="border-b border-line px-4 py-3 text-[15px] text-ink">Size</p>
        <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2 p-4">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={size === o.key}
              onClick={() => setSize(o.key)}
              className={`border px-3 py-1.5 text-[15px] transition ${
                size === o.key ? "border-amber bg-amber text-white" : "border-[#c9c2b8] text-ink hover:border-amber"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex items-baseline justify-between border-t border-line px-4 py-3">
          <span className="text-[14px] text-muted">{attar ? "Attar: pure oil, no alcohol" : "Perfume: 40% oil"}</span>
          <span className="font-display text-2xl font-bold tabular-nums text-amber">{formatRs(scent.prices[size])}</span>
        </div>
      </div>

      <div className="mt-4 flex items-stretch gap-3">
        <div className="flex items-center border border-line">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center hover:text-amber" aria-label="One fewer">
            <MinusIcon size={15} />
          </button>
          <span className="w-7 text-center tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
            {qty}
          </span>
          <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid size-11 place-items-center hover:text-amber" aria-label="One more">
            <PlusIcon size={15} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            add(scent, size, qty);
            setQty(1);
            onAdded?.();
          }}
          className="btn btn-amber min-w-0 flex-1 !px-3 !text-[13.5px] whitespace-nowrap"
        >
          Add to order
        </button>
      </div>
    </div>
  );
}
