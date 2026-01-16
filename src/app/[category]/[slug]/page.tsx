"use client";
import NewsDetail from "@/views/NewsDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams() as { category: string; slug: string };
  return <NewsDetail nextParams={params} />;
}


