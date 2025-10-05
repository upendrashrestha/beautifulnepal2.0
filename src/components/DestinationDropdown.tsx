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
                        absolute left-0 right-0 z-50 mt-2 w-full sm:w-56
                        rounded-md bg-white shadow-lg
                        max-h-[70vh] overflow-y-auto
                        sm:absolute sm:left-auto sm:right-auto
                    `}
                    role="menu"
                    aria-label="Destination dropdown"
                >
                    <ul className="py-1">
                        {destinations.map((dest) => (
                            <li key={dest._id}>
                                <Link
                                    href={`/destinations/${dest.slug.current}`}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                                className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
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
