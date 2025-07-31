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
  title: "Good Natured AI Look Generator | Good Natured Brand",
  description: "Transform your dog's look with AI!",
  icons: {
    icon: [
      { url: '/good-natured-brand-icon.svg', type: 'image/svg+xml' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-figtree bg-[#0f0f11] text-white">
        {children}
      </body>
    </html>
  );
}
