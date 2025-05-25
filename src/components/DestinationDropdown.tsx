"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import { FaChevronDown } from "react-icons/fa";

export default function DestinationDropdown() {
    const [open, setOpen] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDestinations().then(setDestinations);
    }, []);

    // Close dropdown when clicking outside
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
                className="flex items-center gap-1 text-sm font-semibold text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="true"
                aria-expanded={open}
            >
                Destinations
                <FaChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in"
                    role="menu"
                    aria-label="Destination dropdown"
                >
                    <ul className="py-2 max-h-72 overflow-y-auto">
                        {destinations.map((dest) => (
                            <li key={dest._id}>
                                <Link
                                    href={`/destinations/${dest.slug.current}`}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                                className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 transition-colors"
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
