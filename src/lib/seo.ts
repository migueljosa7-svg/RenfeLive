import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "es_ES",
      siteName: "renfe-live",
      url,
      title: `${title} | renfe-live`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | renfe-live`,
      description,
    },
  };
}

/** Serializa JSON-LD escapando "<" para evitar cierres de script. */
export const jsonLdString = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
