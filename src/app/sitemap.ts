import type { MetadataRoute } from "next";
import { scents } from "@/content/catalogue";
import { collections } from "@/content/collections";
import { absoluteUrl } from "@/lib/seo";

const UPDATED = "2026-10-17";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/scents"), lastModified: UPDATED, changeFrequency: "weekly", priority: 0.9 },
    ...collections.map((c) => ({
      url: absoluteUrl(`/collections/${c.slug}`),
      lastModified: UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...scents.map((s) => ({
      url: absoluteUrl(`/scents/${s.slug}`),
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
