import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Intranet · Ateliers de France",
  description: "Espace collaborateur interne du groupe Ateliers de France",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${cormorant.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
