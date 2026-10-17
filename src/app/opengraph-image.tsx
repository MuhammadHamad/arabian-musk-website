import { OG_SIZE, renderHomeShare } from "@/lib/og";

export const alt = "Arabian Musk: attar and perfume in Peshawar, over 100 scents";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderHomeShare({
    eyebrow: "Arabian Musk · Peshawar",
    title: "Attar & Perfume",
    subtitle: "More than a hundred scents, as alcohol-free attar or perfume with 40% oil.",
    footer: "Shop now",
  });
}
