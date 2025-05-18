'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { fetchDestinations } from '@/sanity/lib/fetch';
import { Destination } from '@/types';

export default function DestinationDropdown() {
    const [show, setShow] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDestinations().then(setDestinations);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button
                onClick={() => setShow((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 text-black text-sm hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {show && (
                <div className="absolute z-50 mt-2 w-100 bg-white rounded shadow-lg border border-gray-200 right-0 ">
                    <ul className="py-2">
                        {destinations.map((dest) => (
                            <li key={dest._id}>
                                <Link
                                    href={`/destinations/${dest.slug.current}`}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setShow(false)} // Close dropdown on selection
                                >
                                    {dest.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
