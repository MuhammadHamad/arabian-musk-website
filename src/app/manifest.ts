import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand}: Attar & Perfume, Peshawar`,
    short_name: site.brand,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0907",
    theme_color: "#0b0907",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
