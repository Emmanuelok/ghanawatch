import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  title: "GhanaWatch — Diaspora Trust & Verification Intelligence",
  description:
    "The intelligence platform that lets Ghanaians abroad verify every cedi, every document, and every brick of their investments back home. AI-powered document forensics, geo-stamped site verification, immutable audit trails.",
  openGraph: {
    title: "GhanaWatch — Verify Everything. Trust Nothing Blindly.",
    description:
      "AI-powered diaspora investment verification: document forensics, site verification, audit trails, fraud forensics across real estate, construction, vehicles, business, education, funerals & medical.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Nav />
        <CommandPalette />
        <main className="min-h-[calc(100vh-180px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
