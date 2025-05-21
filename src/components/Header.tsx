"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import DestinationDropdown from "./DestinationDropdown";
import { FaEnvelope } from 'react-icons/fa';

export default function Header() {
    return (
        <header className="p-2">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image src={logo} alt="logo" width={80} height={100} />
                </Link>


                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* <Link
                        href="/"
                        className="text-sm font-medium hover:bg-gray-100 p-2 rounded-full"
                    >
                        Home
                    </Link> 
                    <Link
                        href="/blogs"
                        className="text-sm font-medium bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                    >
                        Blog
                    </Link>*/}
                    <DestinationDropdown />
                    <Link
                        href="/contact"
                        className="text-sm font-medium bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                    >
                        <FaEnvelope className="w-4 h-4 inline-block" />
                    </Link>
                </div>

            </div>
        </header>
    );
}
