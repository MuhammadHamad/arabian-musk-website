import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

const SUFFIX = ` | ${site.brand}`;
// Google cuts titles at roughly 60-65 characters, so long ones drop the brand suffix.
const MAX_TITLE = 65;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  /** The route has its own opengraph-image file, which config images would override. */
  ownShareImage?: boolean;
};

const DEFAULT_SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Arabian Musk: attars and perfumes, over 100 scents",
};

export function pageMetadata({ title, description, path, absoluteTitle, ownShareImage }: PageMeta): Metadata {
  const absolute = absoluteTitle || title.length + SUFFIX.length > MAX_TITLE;
  const fullTitle = absolute ? title : `${title}${SUFFIX}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: fullTitle,
      description,
      siteName: site.brand,
      locale: "en_PK",
      ...(ownShareImage ? {} : { images: [DEFAULT_SHARE_IMAGE] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ownShareImage ? {} : { images: [DEFAULT_SHARE_IMAGE.url] }),
    },
  };
}
