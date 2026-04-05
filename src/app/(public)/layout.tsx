import FloatingSearch from "@/components/FloatingSearch";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ui/scrollToTop";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
    const DOT_PATTERN =
        "url(\"data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(188,28,43,0.12)'/%3E%3C/svg%3E\")";

    return (
        <>
            <Header />
            <main style={{ background: "#faf7f2", backgroundImage: DOT_PATTERN }}>
                {children}
            </main>
            <Footer />
            <FloatingSearch />
            <ScrollToTop />
        </>
    );
}
