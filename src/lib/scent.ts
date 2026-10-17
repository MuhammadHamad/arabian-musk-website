export type SizeKey = "attar12" | "perfume10" | "perfume30" | "perfume50" | "perfume100";

export type Scent = {
  slug: string;
  name: string;
  /** The well-known perfume this blend is modelled on. Set only where the name clearly refers to one. */
  inspiredBy?: string;
  /** Other spellings customers use, for search. */
  aka?: string[];
  prices: Record<SizeKey, number>;
  /** Place by bottles sold over the last year of sales; absent when it had none. */
  rank?: number;
};

export type Size = { key: SizeKey; kind: "Attar" | "Perfume"; ml: number };

export const SIZES: Size[] = [
  { key: "attar12", kind: "Attar", ml: 12 },
  { key: "perfume10", kind: "Perfume", ml: 10 },
  { key: "perfume30", kind: "Perfume", ml: 30 },
  { key: "perfume50", kind: "Perfume", ml: 50 },
  { key: "perfume100", kind: "Perfume", ml: 100 },
];

const SIZE_BY_KEY = Object.fromEntries(SIZES.map((s) => [s.key, s])) as Record<SizeKey, Size>;

export function sizeOf(key: SizeKey): Size {
  return SIZE_BY_KEY[key];
}

export function sizeLabel(key: SizeKey): string {
  const s = SIZE_BY_KEY[key];
  return `${s.kind} ${s.ml} ml`;
}

export function isSizeKey(value: unknown): value is SizeKey {
  return typeof value === "string" && value in SIZE_BY_KEY;
}

/** The top sellers get a badge. */
export const BEST_SELLER_COUNT = 8;

export function isBestSeller(scent: Scent): boolean {
  return scent.rank !== undefined && scent.rank <= BEST_SELLER_COUNT;
}

export function lowestPrice(scent: Scent): number {
  return Math.min(...Object.values(scent.prices));
}

/** "Rs 1,050". Grouped by hand so server and browser always agree. */
export function formatRs(amount: number): string {
  return `Rs ${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Lower-case letters and digits only, so "Erba-Pura" finds "erbapura". */
export function searchKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function matchesSearch(scent: Scent, query: string): boolean {
  const q = searchKey(query);
  if (!q) return true;
  return [scent.name, scent.inspiredBy ?? "", ...(scent.aka ?? [])].some((t) => searchKey(t).includes(q));
}
