import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
// @ts-ignore: CSS import side-effect type declarations missing
import "./globals.css";
import LayoutProvider from "../components/layout/LayoutProvider";
import { cookies } from "next/headers";
import Dialog from "@/components/common/dialog/Dialog";
import { AuthWatcher } from "@/lib/AuthWatcher";

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
  const Cookie = (await cookies()).get("role")?.value;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {Cookie && Cookie !== "USER" ? (
          <div className="fixed bottom-6 right-6 z-10">
            <Dialog />
          </div>
        ) : null}
        <AuthWatcher />
        <LayoutProvider>{children}</LayoutProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
