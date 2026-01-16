import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "रामपुर न्यूज़ | Rampur News",
  description:
    "रामपुर और उत्तर प्रदेश की ताज़ा खबरें: स्थानीय, शिक्षा, खेल, मनोरंजन और अधिक।",
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
