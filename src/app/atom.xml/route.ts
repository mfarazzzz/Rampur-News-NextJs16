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

  const updated =
    items[0]?.publishedDate || new Date().toISOString();

  const atom = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom">`,
    `<title>रामपुर न्यूज़ | Rampur News</title>`,
    `<id>${BASE_URL}/</id>`,
    `<link href="${BASE_URL}/atom.xml" rel="self" />`,
    `<link href="${BASE_URL}/" rel="alternate" />`,
    `<updated>${new Date(updated).toISOString()}</updated>`,
    `<author><name>रामपुर न्यूज़</name></author>`,
    ...items.map((item) => {
      const url = `${BASE_URL}/${item.category}/${item.slug}`;
      return [
        `<entry>`,
        `<title><![CDATA[${item.title}]]></title>`,
        `<id>${url}</id>`,
        `<link href="${url}" />`,
        `<updated>${new Date(item.publishedDate).toISOString()}</updated>`,
        `<summary><![CDATA[${item.excerpt}]]></summary>`,
        `</entry>`,
      ].join("");
    }),
    `</feed>`,
  ].join("");

  return new NextResponse(atom, {
    status: 200,
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}

