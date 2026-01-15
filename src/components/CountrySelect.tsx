'use client';

import { ALL_COUNTRIES } from '@/utils/constant';
import { useEffect, useRef, useState } from 'react';

interface Props {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function CountrySelect({ label, value, onChange }: Props) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const filtered = ALL_COUNTRIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
    );

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            {label && <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
                {label}
            </label>}
            <input
                type="text"
                value={query || value}
                placeholder="Search country"
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            {open && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow">
                    {filtered.length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-500">
                            No results
                        </li>
                    )}

                    {filtered.map((country) => (
                        <li
                            key={country}
                            onClick={() => {
                                onChange(country);
                                setQuery('');
                                setOpen(false);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            {country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
