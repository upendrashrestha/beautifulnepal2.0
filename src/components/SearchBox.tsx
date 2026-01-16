"use client";

import { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { SearchQueryResult } from "@/types";
import Link from "next/link";
import Button from "./ui/Button";

export default function SearchBox() {
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
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const allResults = results 
        ? [...results.posts, ...results.guides, ...results.destinations, ...results.categories, ...results.events]
        : [];

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            posts: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            guides: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            destinations: "bg-black-500/10 text-black-600 dark:text-black-400 border-black-500/20",
            categories: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
            "whats-happening": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        };
        return colors[type] || "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    };

    const getTypeLabel = (type: string) => {
        return type === "whats-happening" ? "events" : type;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Search Input */}
            <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                {/* Decorative gradient border effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-black-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 ${isFocused ? 'opacity-30' : ''}`} />
                
                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Search Icon */}
                    <div className="pl-6 pr-3 flex items-center">
                        <FaSearch className={`text-lg transition-colors duration-300 ${isFocused ? 'text-black-500' : 'text-gray-400'}`} />
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="Search destinations, guides, events..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 py-4 pr-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base"
                    />

                    {/* Search Button */}

                      <Button label="Search" loading={loading} loadingLabel="Searching..." 
                      disabled={loading || !term.trim()}

                        onClick={handleSearch}
                        className="m-2"
                      />
           
                </div>
            </div>

            {/* Results Section */}
            {(loading || allResults.length > 0) && (
                <div className="mt-8">

                  
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <FaSpinner className="animate-spin text-3xl text-black-500" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Searching...</p>
                            </div>
                        </div>
                    )}

                    {!loading && allResults.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Found {allResults.length} {allResults.length === 1 ? 'result' : 'results'}
                                </h3>
                            </div>

                            <div className="grid gap-3">
                                {allResults.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/${item.type}/${item.slug?.current}`}
                                        className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-black-300 dark:hover:border-black-700 transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 text-left min-w-0">
                                                <h6 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-black-600 dark:group-hover:text-black-400 transition-colors truncate">
                                                    {"title" in item ? item.title : item.name}
                                                </h6>
                                            </div>
                                            
                                             <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type || "")}`}>
                                                {getTypeLabel(item.type || "")}
                                            </span> 
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && allResults.length === 0 && results && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <FaSearch className="text-2xl text-gray-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">No results found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try different keywords</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}