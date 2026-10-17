"use client";

import { useEffect, useState } from "react";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { formatRs, SIZES, type Scent, type SizeKey } from "@/lib/scent";

const KINDS = ["Attar", "Perfume"] as const;

/** Every size and price of a scent; tapping one adds it to the order. */
export function PriceList({ scent, tone = "light" }: { scent: Scent; tone?: "light" | "dark" }) {
  const { add } = useOrder();
  const [added, setAdded] = useState<SizeKey | null>(null);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(null), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  const dark = tone === "dark";

  return (
    <div className="space-y-1" role="group" aria-label={`${scent.name}: sizes and prices`}>
      {KINDS.map((kind) => (
        <div key={kind} className="grid grid-cols-[4.25rem_1fr] items-start">
          <span
            className={`pt-[0.7rem] text-[10.5px] font-medium uppercase tracking-[0.14em] ${dark ? "text-gold-300" : "text-gold-700"}`}
          >
            {kind}
          </span>
          <ul>
            {SIZES.filter((s) => s.kind === kind).map((s) => {
              const price = scent.prices[s.key];
              const isAdded = added === s.key;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => {
                      add(scent, s.key);
                      setAdded(s.key);
                    }}
                    aria-label={`Add ${scent.name}, ${kind.toLowerCase()} ${s.ml} ml, ${formatRs(price)}, to your order`}
                    className={`group flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-left text-[15px] transition ${
                      dark ? "hover:bg-white/5" : "hover:bg-sand-100"
                    }`}
                  >
                    <span className={`w-12 shrink-0 whitespace-nowrap tabular-nums ${dark ? "text-sand-200" : "text-ink-700"}`}>{s.ml} ml</span>
                    <span
                      aria-hidden
                      className={`h-px min-w-3 flex-1 border-b border-dotted ${dark ? "border-sand-100/20" : "border-sand-300"}`}
                    />
                    <span className={`shrink-0 whitespace-nowrap tabular-nums font-medium ${dark ? "text-sand-50" : "text-ink-900"}`}>
                      {formatRs(price)}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-7 shrink-0 place-items-center rounded-full border transition ${
                        isAdded
                          ? "border-gold-500 bg-gold-500 text-ink-950"
                          : dark
                            ? "border-gold-400/50 text-gold-300 group-hover:border-gold-300 group-hover:bg-gold-400 group-hover:text-ink-950"
                            : "border-gold-600/50 text-gold-700 group-hover:border-gold-600 group-hover:bg-gold-500 group-hover:text-ink-950"
                      }`}
                    >
                      {isAdded ? <CheckIcon size={15} /> : <PlusIcon size={15} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
