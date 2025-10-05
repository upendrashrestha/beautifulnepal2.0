"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import DestinationDropdown from "./DestinationDropdown";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaCalendarAlt, FaEnvelope } from "react-icons/fa";

export default function Header() {
    const [stickyMenu, setStickyMenu] = useState(false);
    const [navigationOpen, setNavigationOpen] = useState(false);
    const pathUrl = usePathname();

    // Sticky menu
    useEffect(() => {
        const handleStickyMenu = () => {
            setStickyMenu(window.scrollY >= 30);
        };

        window.addEventListener("scroll", handleStickyMenu);
        return () => window.removeEventListener("scroll", handleStickyMenu);
    }, []);

    return (
        <header
            className={`fixed left-0 top-0 z-50 w-full transition duration-200 ${stickyMenu
                ? "bg-white p-4 shadow-sm dark:bg-black"
                : "p-7"
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

                    <button
                        aria-label="Toggle Navigation"
                        className="xl:hidden"
                        onClick={() => setNavigationOpen(!navigationOpen)}
                    >
                        <svg
                            className="h-6 w-6 text-black dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {navigationOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <div
                    className={`w-full xl:flex xl:items-center xl:justify-end xl:gap-6 ${navigationOpen ? "block mt-4 bg-white dark:bg-black p-4 rounded-md shadow-md xl:mt-0 xl:bg-transparent xl:p-0 xl:shadow-none" : "hidden"
                        }`}
                >
                    <nav className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4">
                        <DestinationDropdown />
                        <Link
                            href="/whats-happening"
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-colors ${pathUrl === "/whats-happening"
                                ? "text-primary"
                                : "text-gray-800 hover:text-primary hover:bg-gray-100"
                                }`}
                        >
                            <FaCalendarAlt /> What&apos;s happening?
                        </Link>
                        <Link
                            href="/contact"
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-colors ${pathUrl === "/contact"
                                ? "text-primary"
                                : "text-gray-800 hover:text-primary hover:bg-gray-100"
                                }`}
                        ><FaEnvelope />  Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
