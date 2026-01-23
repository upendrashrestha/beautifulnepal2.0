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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes((query || value).toLowerCase())
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

  // Reset highlight when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const selectCountry = (country: string) => {
    onChange(country);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative space-y-1">
      {label && (
        <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">
          {label}
        </label>
      )}

      <input
        type="text"
        value={query || value}
        placeholder="Search country"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || filtered.length === 0) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i) =>
              Math.min(i + 1, filtered.length - 1)
            );
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
          }

          if (e.key === 'Enter') {
            e.preventDefault();
            selectCountry(filtered[highlightedIndex]);
          }

          if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        className="
          w-full
          bg-transparent
          pb-3.5
          border-b
          focus-visible:outline-none
        "
      />

      {open && (
        <ul
          className="text-left
            absolute z-20 mt-1 max-h-60 w-full overflow-auto
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-lg
          "
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">
              No results
            </li>
          )}

          {filtered.map((country, index) => (
            <li
              key={country}
              onClick={() => selectCountry(country)}
              className={`
                cursor-pointer px-3 py-2 text-sm
                ${
                  index === highlightedIndex
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
