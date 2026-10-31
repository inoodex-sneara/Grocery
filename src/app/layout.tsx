import type { Metadata } from "next";
import { geistSans, geistMono } from "./fonts";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/providers/Providers";
import Footer from "@/components/footer/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groca - Grocery Mart & Organic Food Store",
  description: "Fresh and organic grocery shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lemonada:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
