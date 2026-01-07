import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookEmpire AI - Generate Complete Books in Minutes",
  description: "The world's most advanced AI book creation platform. Generate production-ready books with ultra-realistic covers, 50,000+ word manuscripts, and instant publishing capabilities.",
  keywords: ["AI book generation", "automated book writing", "book creator", "AI author", "manuscript generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
