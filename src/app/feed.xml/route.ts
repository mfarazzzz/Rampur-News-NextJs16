import { NextResponse } from "next/server";
import { mockNewsData } from "@/data/mockNews";

const BASE_URL = "https://rampurnews.com";

export async function GET() {
  const items = Object.entries(mockNewsData)
    .flatMap(([category, articles]) =>
      articles.map((article) => ({
        category,
        ...article,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, 50);

  const lastBuildDate =
    items[0]?.publishedDate || new Date().toISOString();

  const rss = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `<channel>`,
    `<title>रामपुर न्यूज़ | Rampur News</title>`,
    `<link>${BASE_URL}</link>`,
    `<description>रामपुर और उत्तर प्रदेश की ताज़ा खबरें</description>`,
    `<language>hi-IN</language>`,
    `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`,
    `<atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...items.map((item) => {
      const url = `${BASE_URL}/${item.category}/${item.slug}`;
      return [
        `<item>`,
        `<title><![CDATA[${item.title}]]></title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<description><![CDATA[${item.excerpt}]]></description>`,
        `<pubDate>${new Date(item.publishedDate).toUTCString()}</pubDate>`,
        `<category><![CDATA[${item.categoryHindi}]]></category>`,
        `</item>`,
      ].join("");
    }),
    `</channel>`,
    `</rss>`,
  ].join("");

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

