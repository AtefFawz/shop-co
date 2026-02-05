import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import LayoutProvider from "../components/layout/LayoutProvider"; // استدعاء الكومبوننت الجديد

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ كدا الميتا داتا هتشتغل 10/10 لأن الملف بقى Server Component
export const metadata: Metadata = {
  title: "Shop-co",
  description: "Your one-stop shop for fashion and lifestyle products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* حطينا الناف والفوتر واللوجيك كله جوه البروفايدر ده */}
        <LayoutProvider>{children}</LayoutProvider>

        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
