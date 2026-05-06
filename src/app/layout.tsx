import type { Metadata } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hermes Trismegistus — As Above, So Below",
  description:
    "Hermetic showcase by Pixelpiraterij. Seven scrolls of correspondence ending in the sanctum.",
  metadataBase: new URL("https://hermestrismegistus.nl"),
  openGraph: {
    title: "Hermes Trismegistus",
    description: "As above, so below.",
    url: "https://hermestrismegistus.nl",
    siteName: "Hermes Trismegistus",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${cinzel.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="bg-background text-foreground font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
