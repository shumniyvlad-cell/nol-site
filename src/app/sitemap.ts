import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = [
  "",
  "/diagnostic",
  "/how-it-works",
  "/stories",
  "/media",
  "/about",
  "/contacts",
  "/privacy",
  "/personal-data-consent",
  "/terms",
  "/legal",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/diagnostic" ? 0.9 : 0.6,
  }));
}
