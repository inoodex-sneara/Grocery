import type { Metadata } from "next";
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
    <html lang="en" className="h-full antialiased">
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
