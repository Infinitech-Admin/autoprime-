import type { Metadata, Viewport } from "next";

import { Inter, Rajdhani } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import ChatWidget from "@/components/chat-widget";
import FloatingSocial from "@/components/floating-social";
import AnimatedSplash from "@/components/animated-splash";

// Squared, techy headings that match the "Auto-Prime Car Trading" lettering on the logo
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Auto-Prime Car Trading | Cars for Sale",
    template: "%s | Auto-Prime Car Trading",
  },

  description:
    "Discover quality vehicles for sale at Auto-Prime Car Trading. Browse premium cars, explore detailed specifications, view photos and videos, and inquire about your next vehicle.",

  keywords: [
    "Auto-Prime Car Trading",
    "cars for sale",
    "used cars",
    "pre-owned cars",
    "car dealership",
    "car trading",
    "vehicles for sale",
    "automotive",
    "premium cars",
  ],

  authors: [{ name: "Auto-Prime Car Trading" }],
  creator: "Auto-Prime Car Trading",
  publisher: "Auto-Prime Car Trading",

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Auto-Prime Car Trading",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Auto-Prime Car Trading | Cars for Sale",
    description:
      "Explore quality vehicles with detailed specifications, photos, videos, and easy inquiry options.",
    siteName: "Auto-Prime Car Trading",
  },

  twitter: {
    card: "summary_large_image",
    title: "Auto-Prime Car Trading | Cars for Sale",
    description:
      "Find your next vehicle. Browse our latest inventory and explore every car in detail.",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0A0A0A]">
        <AuthProvider>
          <CartProvider>
            {children}
            <AnimatedSplash />
            <FloatingSocial />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
