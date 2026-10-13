import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeetLearn",
  description: "Pattern-based LeetCode learning paths with weekly spaced repetition.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
