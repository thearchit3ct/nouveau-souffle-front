import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SuperTokensProvider } from "@/components/providers/SuperTokensProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nouveau Souffle en Mission",
  description: "Plateforme associative de gestion et de mise en relation - Nouveau Souffle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SuperTokensProvider>{children}</SuperTokensProvider>
      </body>
    </html>
  );
}
