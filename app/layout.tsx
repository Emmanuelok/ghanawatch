import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { CurrencyProvider } from "@/components/currency-context";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ghanawatch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GhanaWatch — Diaspora Trust & Verification Intelligence",
    template: "%s · GhanaWatch",
  },
  description:
    "The intelligence platform that lets Ghanaians abroad verify every cedi, every document, and every brick of their investments back home. AI-powered document forensics, geo-stamped site verification, immutable audit trails.",
  applicationName: "GhanaWatch",
  keywords: [
    "Ghana diaspora", "remittance verification", "land fraud Ghana", "document forensics",
    "construction verification", "trustee", "escrow", "Lands Commission", "diaspora investment",
  ],
  authors: [{ name: "GhanaWatch" }],
  openGraph: {
    type: "website",
    siteName: "GhanaWatch",
    title: "GhanaWatch — Verify Everything. Trust Nothing Blindly.",
    description:
      "AI-powered diaspora investment verification: document forensics, site verification, audit trails, fraud forensics across real estate, construction, vehicles, business, education, funerals & medical.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "GhanaWatch — Diaspora Trust & Verification Intelligence",
    description: "Verify every cedi, every document, every brick of your investment back home.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0a0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">
        <CurrencyProvider>
          <Nav />
          <CommandPalette />
          <main className="min-h-[calc(100vh-180px)]">{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
