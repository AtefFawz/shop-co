// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
// @ts-ignore CSS side-effect imports are handled by Next.js.
import "./globals.css";
import { AuthWatcher } from "@/lib/AuthWatcher";
import { Toaster } from "react-hot-toast";
import NotificationListener from "@/features/notifications/components/NotificationListener";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { LocaleProvider } from "@/shared/i18n/LocaleProvider";
import type { Locale } from "@/shared/i18n/messages";
import ToastSoundListener from "@/shared/components/feedback/ToastSoundListener";
import { DisplayPreferencesProvider } from "@/shared/preferences/DisplayPreferencesProvider";
import { NotificationPreferencesProvider } from "@/shared/preferences/NotificationPreferencesProvider";
import PWAInstallPrompt from "@/shared/components/pwa/PWAInstallPrompt";

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

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/*                         SITE URL & VIEWPORT CONFIG                         */
/* -------------------------------------------------------------------------- */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shop-co-jfqp.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
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
    default: "SHOP.CO™ | أزياء تعبّر عن أسلوبك",
    template: "%s — SHOP.CO™",
  },
  description:
    "اكتشف تشكيلة منتقاة من الأزياء العصرية والقطع الأساسية من علامات تجارية عالمية، مع تجربة تسوق سهلة وآمنة.",
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
  appleWebApp: {
    capable: true,
    title: "SHOP.CO",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: "SHOP.CO™ — Official Online Flagship",
    title: "SHOP.CO™ | أزياء تعبّر عن أسلوبك",
    description:
      "تسوّق أحدث صيحات الموضة والقطع الأساسية المختارة بعناية من SHOP.CO.",
  },

  twitter: {
    card: "summary_large_image",
    title: "SHOP.CO™ | Contemporary Fashion & Street Luxe",
    description:
      "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.",
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
/*                                 ROOT LAYOUT                                */
/* -------------------------------------------------------------------------- */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("shopco-language")?.value;
  const initialLocale: Locale = savedLocale === "en" ? "en" : "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "SHOP.CO",
    url: SITE_URL,
    description:
      "Contemporary fashion destination with curated garments from international brands.",
    priceRange: "$$",
  };

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      data-locale={initialLocale}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var root = document.documentElement;
                var savedTheme = null;
                try { savedTheme = localStorage.getItem('shopco-theme'); } catch (_) {}
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var initialTheme = savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark) ? 'dark' : 'light';
                root.classList.toggle('dark', initialTheme === 'dark');
                root.dataset.theme = initialTheme;
                root.style.colorScheme = initialTheme;

                var preferences = {};
                try {
                  preferences = JSON.parse(localStorage.getItem('shopco-display-preferences') || '{}') || {};
                } catch (_) {}
                root.dataset.fontSize = ['small', 'standard', 'large'].indexOf(preferences.fontSize) >= 0 ? preferences.fontSize : 'standard';
                root.dataset.lineSpacing = preferences.lineSpacing === 'comfortable' ? 'comfortable' : 'standard';
                root.dataset.reduceMotion = String(preferences.reduceMotion === true);
                root.dataset.highContrast = String(preferences.highContrast === true);
              })();
            `,
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              .shopco-toast [role="status"] {
                min-width: 0 !important;
                flex: 1 1 0% !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} relative min-h-screen overflow-x-clip font-sans antialiased`}
      >
        <ThemeProvider>
          <LocaleProvider initialLocale={initialLocale}>
            <DisplayPreferencesProvider>
              <NotificationPreferencesProvider>
                <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
              />

              {/* Global App Listeners */}
              <ToastSoundListener />
              <NotificationListener />
              <AuthWatcher />
              <PWAInstallPrompt />

              {/* Main Content */}
              {children}

              {/* Application toast notifications */}
              <Toaster
                position="top-center"
                gutter={10}
                containerStyle={{
                  top: 16,
                  left: 12,
                  right: 12,
                }}
                toastOptions={{
                  className: "shopco-toast",
                  duration: 3500,
                  style: {
                    minWidth: "fit",
                    maxWidth: "min(410px, calc(100vw - 15px))",
                    background:
                      "color-mix(in srgb, var(--surface) 50%, transparent)",
                    color: "var(--text-primary)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid var(--border)",
                    borderRadius: "99999px",
                    padding: "8px 16px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    boxShadow: "var(--shadow-floating)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    display: "flex",
                    gap: " 10px",
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
              </NotificationPreferencesProvider>
            </DisplayPreferencesProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
