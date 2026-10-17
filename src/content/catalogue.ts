import { scents } from "@/content/scents";
import { isBestSeller, lowestPrice, type Scent } from "@/lib/scent";

export { scents };

const BY_SLUG = new Map(scents.map((s) => [s.slug, s]));

export function getScent(slug: string): Scent | undefined {
  return BY_SLUG.get(slug);
}

/** Sold scents by sales, then the rest A to Z. */
export function byPopularity(a: Scent, b: Scent): number {
  return (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name);
}

export const bestSellers: Scent[] = scents.filter(isBestSeller).sort(byPopularity);

export const SCENT_COUNT = scents.length;
export const LOWEST_PRICE = Math.min(...scents.map(lowestPrice));
export const LOWEST_ATTAR_PRICE = Math.min(...scents.map((s) => s.prices.attar12));
export const HIGHEST_PRICE = Math.max(...scents.map((s) => s.prices.perfume100));

/** Scents priced closest to this one (by the 12 ml attar), best sellers first among equals. */
export function similarlyPriced(scent: Scent, count = 4): Scent[] {
  return scents
    .filter((s) => s.slug !== scent.slug)
    .sort(
      (a, b) =>
        Math.abs(a.prices.attar12 - scent.prices.attar12) - Math.abs(b.prices.attar12 - scent.prices.attar12) ||
        byPopularity(a, b),
    )
    .slice(0, count);
}
