import { getScent, scents } from "@/content/catalogue";
import { OG_SIZE, renderScentShare } from "@/lib/og";
import { priceRange, sceneFor } from "@/lib/scent";

export const alt = "A scent from Arabian Musk, with its attar and perfume prices";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return scents.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const scent = getScent((await params).slug)!;
  return renderScentShare({
    name: scent.name,
    no: scent.no,
    line: scent.inspiredBy ? `Impression of ${scent.inspiredBy}` : "Attar & perfume",
    prices: priceRange(scent),
    footer: "Order on WhatsApp",
    scene: sceneFor(scent),
  });
}
