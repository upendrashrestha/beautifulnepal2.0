"use client";

import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Button from "./ui/Button";
import { SearchQueryResult } from "@/types";

export default function Search() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchQueryResult>();
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  async function handleSearch() {
    if (!term.trim()) return;

    setLoading(true);
    setResults(undefined);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data: SearchQueryResult = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  const allResults = results
    ? [
        ...results.posts,
        ...results.guides,
        ...results.destinations,
        ...results.categories,
        ...results.events,
      ]
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      {/* Search Bar */}
<div className="sticky top-4 z-30">
  <div className="rounded-2xl border bg-white shadow-lg dark:bg-gray-900">
    <div className="flex flex-col sm:flex-row w-full">
      {/* Input */}
      <div className="flex items-center gap-3 w-full px-4 py-4">
        <FaSearch className="text-gray-400 shrink-0" />

        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search destinations, guides, events..."
          className="w-full flex-1 bg-transparent text-base focus:outline-none"
        />

        {term && (
          <button
            onClick={() => setTerm("")}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Button */}
      <div className="w-full sm:w-auto px-4 pb-4 sm:p-2">
        <Button
          label="Search"
          loading={loading}
          disabled={!term.trim()}
          onClick={handleSearch}
          loadingLabel="Searching..."
          className="w-full sm:w-auto px-6"
        />
      </div>
    </div>
  </div>
</div>

      {/* Results */}
      <div className="mt-6 space-y-3">
        {loading && <SearchSkeleton />}

        {!loading &&
          allResults.map((item) => (
            <Link
              key={item._id}
              href={`/${item.type}/${item.slug?.current}`}
              className="
                block rounded-xl border bg-white p-4
                transition hover:shadow-md active:scale-[0.98]
                dark:bg-gray-900
              "
            >
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-base line-clamp-2">
                  {"title" in item ? item.title : item.name}
                </p>

                <span className="self-start rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {item.type === "whats-happening" ? "events" : item.type}
                </span>
              </div>
            </Link>
          ))}

        {!loading && results && allResults.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            No results found
          </p>
        )}
      </div>
    </div>
  );
}

/* Skeleton */
function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border bg-white p-4 dark:bg-gray-900"
        >
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}
