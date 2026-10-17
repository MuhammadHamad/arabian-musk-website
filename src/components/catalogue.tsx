"use client";

import { useMemo, useState } from "react";
import { scents } from "@/content/scents";
import { SearchIcon, WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { whatsappLink } from "@/lib/links";
import { isBestSeller, matchesSearch, type Scent } from "@/lib/scent";

type SortKey = "popular" | "price-asc" | "price-desc" | "name" | "number";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most loved" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
  { key: "name", label: "Name, A to Z" },
  { key: "number", label: "Register number" },
];

const compare: Record<SortKey, (a: Scent, b: Scent) => number> = {
  popular: (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name),
  "price-asc": (a, b) => a.prices.perfume10 - b.prices.perfume10 || a.prices.attar12 - b.prices.attar12 || a.name.localeCompare(b.name),
  "price-desc": (a, b) => b.prices.perfume10 - a.prices.perfume10 || b.prices.attar12 - a.prices.attar12 || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name),
  number: (a, b) => a.no - b.no,
};

export function Catalogue() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [bestOnly, setBestOnly] = useState(false);

  const visible = useMemo(
    () => scents.filter((s) => (!bestOnly || isBestSeller(s)) && matchesSearch(s, query)).sort(compare[sort]),
    [query, sort, bestOnly],
  );

  return (
    <div>
      <div className="z-30 border-y border-line bg-paper/95 backdrop-blur md:sticky md:top-[4.5rem]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-8">
          <label className="relative flex min-w-0 flex-1 basis-full items-center gap-3 border-b border-ink/25 py-2 focus-within:border-ink sm:basis-64">
            <SearchIcon size={17} className="shrink-0 text-muted" />
            <span className="sr-only">Search scents</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a scent, or the perfume it recalls"
              className="w-full bg-transparent text-[15px] placeholder:text-muted/80 focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-pressed={bestOnly}
              onClick={() => setBestOnly((v) => !v)}
              className={`caps py-2 transition ${bestOnly ? "text-ink underline decoration-1 underline-offset-[6px]" : "text-muted hover:text-ink"}`}
            >
              Best sellers
            </button>
            <label className="caps flex items-center gap-2 text-muted">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer appearance-none bg-transparent py-2 pr-1 text-ink focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="caps mt-8 !text-[10.5px] text-muted" aria-live="polite">
          {visible.length === scents.length ? `${scents.length} scents` : `${visible.length} of ${scents.length} scents`}
        </p>

        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {visible.map((s, i) => (
              <ProductCard key={s.slug} scent={s} headingLevel="h2" priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Nothing called &ldquo;{query}&rdquo;, yet.</p>
            <p className="mx-auto mt-3 max-w-md text-muted">Our stock changes, so ask us: we may have it, or something close.</p>
            <a
              href={whatsappLink(`Assalam o Alaikum Arabian Musk! Do you have ${query || "a scent"}?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ink mt-8"
            >
              <WhatsAppIcon size={17} />
              Ask on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
