import type { Metadata } from "next";
import { Inter, Montserrat } from 'next/font/google'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import ScrollToTop from "@/components/ui/scrollToTop";
import PageProgressBar from "@/components/PageProgressBar";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-montserrat' })


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
      <meta name="google-site-verification" content="iN2yAIxp64iNnrFzQLw4I5lw0iEMXyVsbjzEDTAqx1k" />
      <body className={`font-inter`}>
<AuthProvider>
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <PageProgressBar />
        </Suspense>
        <Header />

        <div
          className="
    mx-auto
    px-4 sm:px-6 lg:px-8
    pb-12
    pt-30    
    min-h-screen
    bg-gray-50
    dark:bg-gray-900
  ">
          {children}
        </div>

        <Footer />
          <ScrollToTop />
          </AuthProvider>
        {/* {env.NEXT_PUBLIC_GTM_ID ? (
          <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        ) : null} */}
      </body>
    </html >
  );
}
