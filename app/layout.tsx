import type { Metadata } from "next";
import { garamond } from "@/lib/fonts";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/nav/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gordon's Birds",
  description:
    "A photographic field archive of birds — browse the collection by catalogue and geography.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
