import type { Metadata } from "next";
import { geistSans, geistMono } from "./fonts";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/providers/Providers";
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
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
