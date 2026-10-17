"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { useOrder } from "@/components/order-provider";
import { formatRs, SIZES, type Scent, type Size, type SizeKey } from "@/lib/scent";

const KINDS = ["Perfume", "Attar"] as const;
type Kind = (typeof KINDS)[number];

const NOTES: Record<Kind, string> = {
  Perfume: "A spray made with 40% perfume oil.",
  Attar: "Pure perfume oil, no alcohol. Smaller sizes on request.",
};

/** Choose attar or perfume, a size and a quantity, then add to the order. */
export function SizePicker({
  scent,
  tone = "light",
  onAdded,
}: {
  scent: Scent;
  tone?: "light" | "dark";
  onAdded?: () => void;
}) {
  const { add } = useOrder();
  const [kind, setKind] = useState<Kind>("Perfume");
  const [size, setSize] = useState<SizeKey>("perfume30");
  const [qty, setQty] = useState(1);
  const dark = tone === "dark";
  const sizes = SIZES.filter((s) => s.kind === kind);
  const price = scent.prices[size];

  function chooseKind(k: Kind) {
    setKind(k);
    const first: Size = SIZES.find((s) => s.kind === k && (k === "Attar" || s.ml === 30))!;
    setSize(first.key);
  }

  const boxBase = "flex flex-col items-center justify-center border px-2 py-3 text-center transition duration-300";
  const boxOff = dark ? "border-white/15 text-paper/80 hover:border-gold/60" : "border-line text-ink-soft hover:border-ink/40";
  const boxOn = dark ? "border-gold bg-gold/10 text-paper" : "border-ink bg-white/60 text-ink";

  return (
    <div>
      <div role="radiogroup" aria-label="Format" className={`grid grid-cols-2 border ${dark ? "border-white/15" : "border-line"}`}>
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            onClick={() => chooseKind(k)}
            className={`caps py-3.5 transition duration-300 ${
              kind === k ? (dark ? "bg-paper text-ink" : "bg-ink text-paper") : dark ? "text-paper/70 hover:text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <p className={`mt-3 text-[13.5px] ${dark ? "text-paper/60" : "text-muted"}`}>{NOTES[kind]}</p>

      <div role="radiogroup" aria-label="Size" className={`mt-4 grid gap-2 ${sizes.length > 1 ? "grid-cols-4" : "grid-cols-1"}`}>
        {sizes.map((s) => (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={size === s.key}
            onClick={() => setSize(s.key)}
            className={`${boxBase} ${size === s.key ? boxOn : boxOff}`}
          >
            <span className="text-[15px]">{s.ml} ml</span>
            <span className={`mt-0.5 whitespace-nowrap text-[11px] tabular-nums min-[360px]:text-[12.5px] ${dark ? "text-paper/55" : "text-muted"}`}>{formatRs(scent.prices[s.key])}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-stretch gap-3">
        <div className={`flex items-center border ${dark ? "border-white/15" : "border-line"}`}>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-11 place-items-center transition hover:opacity-60 sm:size-[3.25rem]"
            aria-label="One fewer"
          >
            <MinusIcon size={15} />
          </button>
          <span className="w-6 text-center tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="grid size-11 place-items-center transition hover:opacity-60 sm:size-[3.25rem]"
            aria-label="One more"
          >
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
          className={`btn min-w-0 flex-1 !px-3 whitespace-nowrap !tracking-[0.14em] sm:!px-4 sm:!tracking-[0.2em] ${dark ? "btn-light" : "btn-ink"}`}
        >
          Add<span className="hidden min-[400px]:inline"> to order</span> · <span className="tabular-nums">{formatRs(price * qty)}</span>
        </button>
      </div>
    </div>
  );
}
