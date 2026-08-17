import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: CSS import side-effect type declarations missing
import "./globals.css";
import LayoutProvider from "../components/layout/LayoutProvider";
import { AuthWatcher } from "@/lib/AuthWatcher";
import { Toaster } from "react-hot-toast";

import NotificationListener from "@/components/notifications/NotificationListener";
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
export const metadata: Metadata = {
  title: "Shop-co",
  description: "Your one-stop shop for fashion and lifestyle products.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <NotificationListener />
        <AuthWatcher />
        <LayoutProvider>{children}</LayoutProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
