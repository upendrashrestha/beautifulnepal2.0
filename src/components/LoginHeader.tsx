"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dbn.png";
import { useEffect, useState } from "react";

export default function Header() {
    const [stickyMenu, setStickyMenu] = useState(false);

    useEffect(() => {
        const handleStickyMenu = () => {
            setStickyMenu(window.scrollY >= 30);
        };

        window.addEventListener("scroll", handleStickyMenu);
        return () => window.removeEventListener("scroll", handleStickyMenu);
    }, []);

    return (
        <header
            className={`fixed left-0 top-0 z-50 w-full transition duration-200 ${stickyMenu ? "p-7 bg-gray-50 p-4 shadow-sm dark:bg-black" : "p-7"
                }`}
        >
            <div className="relative mx-auto w-full items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
                {/* Logo and Mobile Toggle */}
                <div className="flex w-full items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src={logo}
                            alt="Beautiful Nepal Logo"
                            width={90}
                            height={60}
                            priority
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
