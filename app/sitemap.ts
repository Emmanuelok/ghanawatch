import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://ghanawatch.vercel.app";

// Public, indexable marketing + tool surfaces (not owner-private app screens).
const ROUTES = [
  "", "/sectors", "/research", "/knowledge", "/network", "/network/become-a-trustee",
  "/pricing", "/tour", "/demo", "/manager", "/mobile", "/community", "/insurance",
  "/developers", "/partners", "/government", "/transparency", "/status", "/help",
  "/languages", "/referrals", "/achievements", "/case-law", "/legal-search",
  "/tools", "/tools/vehicle-duty", "/tools/cost-simulator", "/benchmarks",
  "/for/uk", "/for/us", "/for/ca", "/for/de", "/diaspora-bond", "/esg", "/hardship",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/for/") || path === "/pricing" ? 0.8 : 0.6,
  }));
}
