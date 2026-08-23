import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { BUSINESS_CONFIG } from "@/config/business";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${BUSINESS_CONFIG.name}`,
    default: `${BUSINESS_CONFIG.name} | Premium Architectural Glass Solutions`,
  },
  description:
    "Exquisite custom glass solutions for contemporary residential and commercial spaces. Custom balustrades, shower screens, pool fencing, and architectural glass engineered to AS1288 standards.",
  metadataBase: new URL(BUSINESS_CONFIG.websiteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BUSINESS_CONFIG.name} | Premium Architectural Glass Solutions`,
    description:
      "Custom glass solutions engineered for contemporary residential and commercial spaces across Australia.",
    siteName: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.websiteUrl,
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_CONFIG.name} | Architectural Glass Solutions`,
    description: "Custom glass balustrades, frameless glass, and bespoke architectural installations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-charcoal font-sans selection:bg-brand-ice selection:text-brand-charcoal-light overflow-x-hidden w-full">
        {children}
      </body>
    </html>
  );
}
