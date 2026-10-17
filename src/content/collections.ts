import { scents } from "@/content/scents";
import { isBestSeller, type Scene, type Scent } from "@/lib/scent";

export type Collection = {
  slug: string;
  title: string;
  blurb: string;
  scene: Scene;
  match: (s: Scent) => boolean;
};

const ARABIAN_HOUSES = /Lattafa|Rasasi|Ajmal|Afnan|Gissah/;

/** Groupings the data can support honestly: sales, names, inspirations and price. */
export const collections: Collection[] = [
  { slug: "best-sellers", title: "Best Sellers", blurb: "The scents chosen most", scene: "wood", match: isBestSeller },
  { slug: "inspired", title: "Inspired Perfumes", blurb: "Our takes on famous perfumes", scene: "marble", match: (s) => Boolean(s.inspiredBy) },
  { slug: "oud-and-musk", title: "Oud & Musk", blurb: "Deep, warm and classic", scene: "plaster", match: (s) => /oud|musk|misk|bakhoor|amber/i.test(s.name) },
  {
    slug: "arabian-houses",
    title: "Arabian Houses",
    blurb: "Inspired by Lattafa, Rasasi, Ajmal and Afnan",
    scene: "sand",
    match: (s) => ARABIAN_HOUSES.test(s.inspiredBy ?? ""),
  },
  { slug: "fruity", title: "Fruity Attars", blurb: "Apple, mango, peach and guava", scene: "marble", match: (s) => /^(apple|mango|peach|guava)$/i.test(s.name) },
  { slug: "under-1000", title: "Under Rs 1,000", blurb: "Attars below a thousand", scene: "wood", match: (s) => s.prices.attar12 < 1000 },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function inCollection(c: Collection): Scent[] {
  return scents.filter(c.match);
}
