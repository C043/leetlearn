import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeetLearn",
  description: "Pattern-based LeetCode learning paths with weekly spaced repetition.",
  appleWebApp: {
    capable: true,
    title: "LeetLearn",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
