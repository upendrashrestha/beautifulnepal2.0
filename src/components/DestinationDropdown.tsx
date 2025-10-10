"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import { FaChevronDown, FaMapPin } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function DestinationDropdown() {
    const [open, setOpen] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathUrl = usePathname();

    useEffect(() => {
        fetchFeaturedDestinations().then(setDestinations);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${pathUrl.startsWith("/destination")
                    ? "text-primary hover:text-primary"
                    : "hover:text-primary"
                    }`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                <FaMapPin />
                Explore Destinations
                <FaChevronDown
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    className={`
    absolute left-0 right-0 z-50 mt-3 w-full sm:w-64
    rounded-2xl bg-white/90 backdrop-blur-md shadow-xl
    max-h-[70vh] overflow-y-auto transition-all duration-200
  `}
                    role="menu"
                    aria-label="Destination dropdown"
                >
                    <ul className="py-2 divide-y divide-gray-50">
                        {destinations.map((dest) => (
                            <li key={dest._id}>
                                <Link
                                    href={`/destinations/${dest.slug.current}`}
                                    onClick={() => setOpen(false)}
                                    className="
            block px-5 py-2 text-[15px] font-medium text-gray-800
            hover:text-blue-600
            transition-colors duration-150
          "
                                    role="menuitem"
                                >
                                    {dest.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link
                                href="/destinations"
                                onClick={() => setOpen(false)}
                                className="
          block px-5 py-3 text-[15px] font-semibold text-gray-400
          hover:text-blue-700
          transition-colors duration-150
        "
                                role="menuitem"
                            >
                                View All Destinations →
                            </Link>
                        </li>
                    </ul>
                </div>

            )}
        </div>
    );
}
