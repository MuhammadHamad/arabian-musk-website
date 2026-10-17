"use client";

import { useMemo, useState } from "react";
import { scents } from "@/content/scents";
import { SearchIcon, WhatsAppIcon } from "@/components/icons";
import { ScentCard } from "@/components/scent-card";
import { whatsappLink } from "@/lib/links";
import { isBestSeller, matchesSearch, type Scent } from "@/lib/scent";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "A to Z" },
];

const compare: Record<SortKey, (a: Scent, b: Scent) => number> = {
  popular: (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name),
  "price-asc": (a, b) => a.prices.attar12 - b.prices.attar12 || a.prices.perfume30 - b.prices.perfume30 || a.name.localeCompare(b.name),
  "price-desc": (a, b) => b.prices.attar12 - a.prices.attar12 || b.prices.perfume30 - a.prices.perfume30 || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function Catalogue() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [bestOnly, setBestOnly] = useState(false);

  const visible = useMemo(
    () => scents.filter((s) => (!bestOnly || isBestSeller(s)) && matchesSearch(s, query)).sort(compare[sort]),
    [query, sort, bestOnly],
  );

  const filtered = visible.length !== scents.length;

  return (
    <div>
      <div className="z-30 -mx-4 border-b sm:sticky sm:top-16 border-sand-200 bg-sand-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="relative min-w-0 flex-1 basis-full sm:basis-auto">
            <span className="sr-only">Search scents</span>
            <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a scent or a perfume it's inspired by"
              className="w-full rounded-full border border-sand-300 bg-white py-2.5 pl-10 pr-4 text-[15px] placeholder:text-stone-500 focus:border-gold-500 focus:outline-none"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort scents</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none rounded-full border border-sand-300 bg-white py-2.5 pl-4 pr-9 text-[15px] focus:border-gold-500 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">
              ▼
            </span>
          </label>
          <button
            type="button"
            aria-pressed={bestOnly}
            onClick={() => setBestOnly((v) => !v)}
            className={`rounded-full border px-4 py-2.5 text-[15px] transition ${
              bestOnly ? "border-gold-600 bg-gold-500 text-ink-950" : "border-sand-300 bg-white hover:border-gold-500"
            }`}
          >
            Best sellers
          </button>
        </div>
      </div>

      <p className="mt-5 text-sm text-stone-600" aria-live="polite">
        {filtered ? `Showing ${visible.length} of ${scents.length} scents` : `All ${scents.length} scents`}
        {sort.startsWith("price") && " · sorted by the 12 ml attar price"}
      </p>

      {visible.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((s) => (
            <ScentCard key={s.slug} scent={s} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-sand-300 bg-white/60 px-6 py-12 text-center">
          <p className="font-display text-2xl">No scent matches &ldquo;{query}&rdquo;.</p>
          <p className="mt-2 text-stone-600">Our stock changes, so ask us. We may have it or something close.</p>
          <a
            href={whatsappLink(`Assalam o Alaikum Arabian Musk! Do you have ${query || "a scent"}?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-sand-50 transition hover:bg-ink-700"
          >
            <WhatsAppIcon size={18} />
            Ask on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
