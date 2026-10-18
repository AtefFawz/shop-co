// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: CSS import side-effect type declarations missing
import "./globals.css";
import { AuthWatcher } from "@/lib/AuthWatcher";
import { Toaster } from "react-hot-toast";
import NotificationListener from "@/features/notifications/components/NotificationListener";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

/* -------------------------------------------------------------------------- */
/*                                FONTS SETUP                                 */
/* -------------------------------------------------------------------------- */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/*                         SITE URL & VIEWPORT CONFIG                         */
/* -------------------------------------------------------------------------- */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shop-co-1fqm.vercel.app";

export const viewport: Viewport = {
  themeColor: "#f5f3f0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* -------------------------------------------------------------------------- */
/*                     PREMIUM SEO & SOCIAL SHARE METADATA                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SHOP.CO™ | Find Clothes That Match Your Style",
    template: "%s — SHOP.CO™ Studio",
  },
  description:
    "Discover meticulously crafted garments from 200+ international luxury houses. Curated streetwear, minimalist tailoring, and contemporary essentials.",
  applicationName: "SHOP.CO",
  authors: [{ name: "SHOP.CO Atelier", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "SHOP.CO",
    "Luxury Streetwear",
    "Contemporary Fashion",
    "Designer Clothing",
    "Minimalist Apparel",
    "Online Fashion Store",
    "Lookbook 2026",
  ],
  referrer: "origin-when-cross-origin",
  creator: "SHOP.CO Studio",
  publisher: "SHOP.CO International",
  category: "fashion",

  alternates: {
    canonical: "/",
  },

  // How the link looks on WhatsApp, Facebook, LinkedIn, Discord, Telegram
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SHOP.CO™ — Official Online Flagship",
    title: "SHOP.CO™ | Find Clothes That Match Your Style",
    description:
      "Explore 2,000+ high-quality pieces from 200+ global luxury brands. Free express shipping & verified authenticity.",
  },

  // How the link looks on X (Twitter)
  twitter: {
    card: "summary_large_image",
    title: "SHOP.CO™ | Contemporary Fashion & Street Luxe",
    description:
      "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.",
    creator: "@shopco",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

/* -------------------------------------------------------------------------- */
/*                                ROOT LAYOUT                                 */
/* -------------------------------------------------------------------------- */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "SHOP.CO",
    url: SITE_URL,
    description:
      "Contemporary fashion destination featuring 200+ international brands and 2,000+ curated garments.",
    priceRange: "$$",
    sameAs: ["https://instagram.com", "https://twitter.com"],
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Apply the saved/system theme before the first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var savedTheme = null; try { savedTheme = localStorage.getItem('shopco-theme'); } catch (_) {} var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; var initialTheme = savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark) ? 'dark' : 'light'; document.documentElement.classList.toggle('dark', initialTheme === 'dark'); document.documentElement.dataset.theme = initialTheme; document.documentElement.style.colorScheme = initialTheme;`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen font-sans antialiased overflow-x-clip `}
      >
        <ThemeProvider>
          {/* Google Rich Snippet Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Global App Listeners */}
          <NotificationListener />
          <AuthWatcher />

          {/* Main Content */}
          {children}

          {/* Application toast notifications */}
          <Toaster
            position="top-center"
            gutter={10}
            containerStyle={{ top: 24 }}
            toastOptions={{
              duration: 3500,
              style: {
                background:
                  "color-mix(in srgb, var(--surface-raised) 94%, transparent)",
                color: "var(--text-primary)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--border)",
                borderRadius: "9999px",
                padding: "12px 22px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                boxShadow: "var(--shadow-floating)",
              },
              success: {
                iconTheme: {
                  primary: "var(--success)",
                  secondary: "var(--surface)",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--danger)",
                  secondary: "var(--surface)",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
