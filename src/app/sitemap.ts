import type { MetadataRoute } from "next";
import { mockNewsData } from "@/data/mockNews";

const BASE_URL = "https://rampurnews.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/rampur",
    "/up",
    "/national",
    "/politics",
    "/crime",
    "/education-jobs",
    "/business",
    "/entertainment",
    "/sports",
    "/health",
    "/religion-culture",
    "/food-lifestyle",
    "/nearby",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/ownership",
    "/editorial-policy",
    "/corrections-policy",
    "/grievance",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = Object.entries(mockNewsData).flatMap(
    ([category, articles]) =>
      articles.map((article) => ({
        url: `${BASE_URL}/${category}/${article.slug}`,
        lastModified: new Date(article.publishedDate),
        changeFrequency: "hourly",
        priority: 0.9,
      }))
  );

  return [...staticEntries, ...articleEntries];
}

