import { getScent, scents } from "@/content/catalogue";
import { OG_SIZE, renderShareImage } from "@/lib/og";
import { formatRs } from "@/lib/scent";

export const alt = "A scent from Arabian Musk, with its attar and perfume prices";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return scents.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const scent = getScent((await params).slug)!;
  return renderShareImage({
    eyebrow: scent.inspiredBy ? `Inspired by ${scent.inspiredBy}` : "Attar & perfume",
    title: scent.name,
    subtitle: `Attar 12 ml ${formatRs(scent.prices.attar12)} · Perfume 30 ml ${formatRs(scent.prices.perfume30)}`,
    footer: "Malogo Chowk, Jhagra, Peshawar · Order on WhatsApp",
  });
}
