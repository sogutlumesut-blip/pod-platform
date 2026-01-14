import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrintMarkt - Custom Wallpaper & Print on Demand",
  description: "The ultimate print-on-demand platform for creators and businesses.",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <div className="bg-red-600 text-white text-center text-sm font-bold p-1">
          DEBUG MODE: v1.2 - IF YOU SEE THIS, DEPLOYMENT IS SUCCESSFUL
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
