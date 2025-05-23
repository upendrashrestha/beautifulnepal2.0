"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import { FaChevronDown } from "react-icons/fa"; // or any icon lib

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
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center text-sm  text-black hover:bg-gray-100 px-3 py-2 rounded-md font-bold"
            >
                Destinations
                <FaChevronDown fontSize={'sm'} className="w-4 h-4 ml-1" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <ul className="py-2">
                        {destinations.map((dest) => (
                            <li key={dest._id}>
                                <Link
                                    href={`/destinations/${dest.slug.current}`}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {dest.name}
                                </Link>
                            </li>
                        ))}
                        <li><Link href="/destinations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All</Link></li>
                    </ul>
                </div>
            )}
        </div>
    );
}
