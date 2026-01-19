import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageProgressBar from "@/components/PageProgressBar";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
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
    <html className={`${inter.variable} ${montserrat.variable}`} lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z6J9XCLJKJ"></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-Z6J9XCLJKJ');`}
      </Script>
      <meta
        name="google-site-verification"
        content="iN2yAIxp64iNnrFzQLw4I5lw0iEMXyVsbjzEDTAqx1k"
      />
      <body className={`font-inter`}>
        <>
          <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
            <PageProgressBar />
          </Suspense>

          {children}
        </>
      </body>
    </html>
  );
}
