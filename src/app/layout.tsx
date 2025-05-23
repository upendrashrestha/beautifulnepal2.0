import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#FFF",
};

export const metadata: Metadata = {
  title: {
    default: "Beautiful Nepal",
    template: "%s | Beautiful Nepal",
  },
  description:
    "Explore the beauty of Nepal with travel guides, treks, and cultural experiences.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <Header />
        <div
          className="
    max-w-7xl
    mx-auto
    px-4 sm:px-6 lg:px-8
    pb-12
    pt-6
    min-h-screen
    bg-gray-50
  ">
          {children}
        </div>

        <Footer />
        {/* {env.NEXT_PUBLIC_GTM_ID ? (
          <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        ) : null} */}
      </body>
    </html >
  );
}
