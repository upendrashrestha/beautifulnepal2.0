// PublicLayout.tsx
import FloatingSearch from "@/components/FloatingSearch";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ui/scrollToTop";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
    const DOT_PATTERN =
        "url(\"data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='rgba(188,28,43,0.08)'/%3E%3C/svg%3E\")";

    return (
        <>
            <Header />
            <main 
                className="min-h-screen" 
                style={{ background: "#faf7f2", backgroundImage: DOT_PATTERN }}
            >
                <div className="mx-auto px-4 md:px-8 lg:px-8 py-15 md:py-12 lg:py-16 space-y-12 md:space-y-16 lg:space-y-20">
                    {children}
                </div>
            </main>
            <Footer />
            <FloatingSearch />
            <ScrollToTop />
        </>
    );
}