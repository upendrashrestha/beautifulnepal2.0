"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/web-app.png";
import DestinationDropdown from "./DestinationDropdown";
import { FaEnvelope } from "react-icons/fa";

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src={logo}
                        alt="Beautiful Nepal Logo"
                        width={100}
                        height={80}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Right: Navigation */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <DestinationDropdown />

                    <Link
                        href="/contact"
                        className="flex items-center gap-1 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaEnvelope className="w-4 h-4" />
                        <span className="hidden sm:inline">Contact</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
