import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://rampurnews.com"),
  title: "रामपुर न्यूज़ | Rampur News",
  description:
    "रामपुर और उत्तर प्रदेश की ताज़ा खबरें: स्थानीय, शिक्षा, खेल, मनोरंजन और अधिक।",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "रामपुर न्यूज़ | Rampur News",
    title: "रामपुर न्यूज़ | Rampur News",
    description:
      "रामपुर और उत्तर प्रदेश की ताज़ा खबरें: स्थानीय, शिक्षा, खेल, मनोरंजन और अधिक।",
    url: "https://rampurnews.com/",
    locale: "hi_IN",
    images: [
      {
        url: "https://rampurnews.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "रामपुर न्यूज़ | Rampur News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@RampurNews",
    creator: "@RampurNews",
    title: "रामपुर न्यूज़ | Rampur News",
    description:
      "रामपुर और उत्तर प्रदेश की ताज़ा खबरें: स्थानीय, शिक्षा, खेल, मनोरंजन और अधिक।",
    images: ["https://rampurnews.com/og-image.jpg"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
