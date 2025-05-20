"use client";

import { useState } from "react";
import {
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
        <div className="max-w-screen-lg mx-auto py-6 px-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                        <SearchIcon fontSize="small" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search blog, destination or guides..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="min-w-[40px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap flex items-center justify-center"
                >
                    {loading ? <CircularProgress size={20} /> : <SearchIcon fontSize="small" />}
                </button>
            </form>

            {loading && <p className="text-gray-500">Searching...</p>}

            {results && (
                <ul className="space-y-2">
                    {[...results.posts, ...results.guides, ...results.destinations, ...results.categories].map((item) => (
                        <li key={item._id} className="flex items-center">
                            <Link
                                href={`/${item.type}/${item.slug.current}`}
                                className="text-blue-600 hover:underline"
                            >
                                {"title" in item ? item.title : item.name}
                            </Link>
                            <span className="ml-2 text-sm text-gray-500">({item.type})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
