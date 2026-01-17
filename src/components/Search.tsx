"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Bar */}
      <div className={`relative transition ${isFocused && "scale-[1.02]"}`}>
        <div className="flex flex-col sm:flex-row justify-between gap-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border sm:w-auto">
          <div className="pl-4 pr-2 flex items-center w-full">
            <FaSearch className="text-gray-400 " />

            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search destinations, guides, events..."
              className="flex-1 px-6 py-5 text-sm sm:text-base bg-transparent focus:outline-none w-full"
            />
          </div>


          <div className=" pr-4">
            <Button
              label="Search"
              loading={loading}
              disabled={!term.trim()}
              onClick={handleSearch}
              loadingLabel="Searching..."
              className="m-2 w-full sm:w-auto sm:text-center"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading && <SearchSkeleton />}

        {!loading &&
          allResults.map((item) => (
            <Link
              key={item._id}
              href={`/${item.type}/${item.slug?.current}`}
              className="block rounded-xl border p-4 mb-3 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <p className="font-semibold truncate">
                  {"title" in item ? item.title : item.name}
                </p>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {item.type === "whats-happening" ? "events" : item.type}
                </span>
              </div>
            </Link>
          ))}

        {!loading && results && allResults.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No results found
          </p>
        )}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border p-4"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}
