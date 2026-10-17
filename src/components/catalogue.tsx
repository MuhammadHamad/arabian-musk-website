"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { collections } from "@/content/collections";
import { scents } from "@/content/scents";
import { SearchIcon, WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { whatsappLink } from "@/lib/links";
import { matchesSearch, type Scent } from "@/lib/scent";

type SortKey = "default" | "price-asc" | "price-desc" | "name" | "number";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default sorting" },
  { key: "price-asc", label: "Sort by price: low to high" },
  { key: "price-desc", label: "Sort by price: high to low" },
  { key: "name", label: "Sort by name" },
  { key: "number", label: "Sort by register number" },
];

const compare: Record<SortKey, (a: Scent, b: Scent) => number> = {
  default: (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name),
  "price-asc": (a, b) => a.prices.perfume10 - b.prices.perfume10 || a.prices.attar12 - b.prices.attar12 || a.name.localeCompare(b.name),
  "price-desc": (a, b) => b.prices.perfume10 - a.prices.perfume10 || b.prices.attar12 - a.prices.attar12 || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name),
  number: (a, b) => a.no - b.no,
};

/** Shop grid: collection links, search, sorting and the product cards. */
export function Catalogue({ collection }: { collection?: string }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const active = collections.find((c) => c.slug === collection);

  const visible = useMemo(
    () => scents.filter((s) => (!active || active.match(s)) && matchesSearch(s, query)).sort(compare[sort]),
    [active, query, sort],
  );
  const total = active ? scents.filter(active.match).length : scents.length;

  return (
    <div className="mx-auto max-w-[90rem] px-5 lg:px-11">
      <nav aria-label="Collections" className="flex flex-wrap justify-center gap-2 pt-10">
        <ChipLink href="/scents" active={!active}>
          All Scents
        </ChipLink>
        {collections.map((c) => (
          <ChipLink key={c.slug} href={`/collections/${c.slug}`} active={active?.slug === c.slug}>
            {c.title}
          </ChipLink>
        ))}
      </nav>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <p className="text-[16px]" aria-live="polite">
          {visible.length === total ? `Showing all ${total} results` : `Showing ${visible.length} of ${total} results`}
        </p>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <label className="relative flex flex-1 items-center sm:w-72 sm:flex-none">
            <span className="sr-only">Search scents</span>
            <SearchIcon size={17} className="pointer-events-none absolute left-3 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scents…"
              className="w-full border border-line py-2.5 pl-10 pr-3 text-[15px] focus:border-amber focus:outline-none"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort scents</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full cursor-pointer appearance-none border border-line bg-white py-2.5 pl-3 pr-9 text-[15px] focus:border-amber focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▼</span>
          </label>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
          {visible.map((s, i) => (
            <ProductCard key={s.slug} scent={s} headingLevel="h2" align="left" priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="font-display text-3xl font-bold text-ink">No scent called &ldquo;{query}&rdquo;.</p>
          <p className="mx-auto mt-3 max-w-md">Our stock changes, so ask us: we may have it, or something close.</p>
          <a href={whatsappLink(`Assalam o Alaikum Arabian Musk! Do you have ${query || "a scent"}?`)} target="_blank" rel="noopener noreferrer" className="btn btn-amber mt-8">
            <WhatsAppIcon size={17} /> Ask on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function ChipLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border px-4 py-2 font-nav text-[12px] font-semibold uppercase tracking-[2px] transition ${
        active ? "border-amber bg-amber text-white" : "border-line text-ink hover:border-amber hover:text-amber"
      }`}
    >
      {children}
    </Link>
  );
}
