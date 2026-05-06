import type { Metadata } from "next";
import { Cinzel, Marcellus, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hermes Trismegistus — As Above, So Below",
  description:
    "Een ritueel in zeven scrollen. Thoth bouwt de piramide; voorbij de capstone wacht het sanctum.",
  metadataBase: new URL("https://hermestrismegistus.nl"),
  openGraph: {
    title: "Hermes Trismegistus",
    description: "Quod superius, sicut inferius.",
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
      className={`${cinzel.variable} ${marcellus.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="text-foreground font-serif">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
