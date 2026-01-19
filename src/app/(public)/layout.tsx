import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ui/scrollToTop";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-30 min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
