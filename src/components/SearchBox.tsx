"use client";

import { useState } from "react";
import { FaCircle, FaSearch } from "react-icons/fa";
import { SearchQueryResult } from "@/types";
import Link from "next/link";

export default function SearchBox() {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState<SearchQueryResult>();
    const [loading, setLoading] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!term.trim()) return;

        setLoading(true);
        setResults(undefined);

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
            const data: SearchQueryResult = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-stretch gap-4 mb-6"
            >
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                        <FaSearch className="text-sm" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search blog, destination, guides or events..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? <FaCircle className="animate-pulse text-sm" /> : <FaSearch className="text-sm" />}
                    <span className="ml-2 hidden sm:inline">Search</span>
                </button>
            </form>

            {loading && <p className="text-gray-500 dark:text-gray-400">Searching...</p>}

            {results && (
                <ul className="space-y-3 mt-4">
                    {[...results.posts, ...results.guides, ...results.destinations, ...results.categories, ...results.events].map((item) => (
                        <li key={item._id} className="flex items-center gap-2 text-sm">
                            <Link
                                href={`/${item.type}/${item.slug?.current}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                {"title" in item ? item.title : item.name}
                            </Link>
                            <span className="text-gray-500 dark:text-gray-400">({item.type === "whats-happening" ? "events" : item.type})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
