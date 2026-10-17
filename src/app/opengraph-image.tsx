import { LOWEST_PRICE } from "@/content/catalogue";
import { OG_SIZE, renderShareImage } from "@/lib/og";
import { formatRs } from "@/lib/scent";

export const alt = "Arabian Musk: attars and perfumes in Peshawar, over 100 scents";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderShareImage({
    eyebrow: "Attar & perfume house",
    title: "Over 100 scents. Pure attar or rich perfume.",
    subtitle: `Alcohol-free attars and perfumes made with 40% oil, from ${formatRs(LOWEST_PRICE)}.`,
    footer: "Malogo Chowk, Jhagra, Peshawar · Order on WhatsApp",
  });
}
