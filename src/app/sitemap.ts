import type { MetadataRoute } from "next";
import { COMMUNITIES, LINES, STATIONS, linePath, stationPath } from "@/lib/transit-data";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "always", priority: 1 },
    ...COMMUNITIES.map((c) => ({
      url: `${SITE_URL}/incidencias/${c.slug}`,
      lastModified: now,
      changeFrequency: "always" as const,
      priority: 0.9,
    })),
    ...LINES.map((l) => ({
      url: `${SITE_URL}${linePath(l)}`,
      lastModified: now,
      changeFrequency: "always" as const,
      priority: 0.8,
    })),
    ...STATIONS.map((s) => ({
      url: `${SITE_URL}${stationPath(s)}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];
}
