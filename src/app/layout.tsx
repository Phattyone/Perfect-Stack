import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://getperfectstack.com"),
  title: "Perfect Stack  -  Men's Performance System",
  description:
    "A complete system for men who want more testosterone, better performance, sharper energy, and a protocol that actually works.",
  alternates: {
    canonical: "https://getperfectstack.com",
  },
  openGraph: {
    url: "https://getperfectstack.com",
    siteName: "Perfect Stack",
    title: "Perfect Stack  -  Men's Performance System",
    description:
      "A complete system for men who want more testosterone, better performance, sharper energy, and a protocol that actually works.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Stack  -  Men's Performance System",
    description:
      "A complete system for men who want more testosterone, better performance, sharper energy, and a protocol that actually works.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
