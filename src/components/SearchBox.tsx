"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { SearchQueryResult } from "@/types";

export default function SearchBox() {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState<SearchQueryResult>();

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!term.trim()) return;

        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data: SearchQueryResult = await res.json();
        setResults(data);
    }

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search blog, destination or guides..."
                    className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                    <SearchIcon className="w-4 h-4" />
                </button>
            </form>

            <ul className="space-y-2">


                {results?.posts.map((item) => (
                    <li key={item._id}>
                        <a href={`/${item.type}/${item.slug.current}`} className="text-blue-600 hover:underline">
                            {item.title}
                        </a>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                    </li>
                ))}

                {results?.guides.map((item) => (
                    <li key={item._id}>
                        <a href={`/${item.type}/${item.slug.current}`} className="text-blue-600 hover:underline">
                            {item.title}
                        </a>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                    </li>
                ))}

                {results?.destinations.map((item) => (
                    <li key={item._id}>
                        <a href={`/${item.type}/${item.slug.current}`} className="text-blue-600 hover:underline">
                            {item.name}
                        </a>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                    </li>
                ))}

                {results?.categories.map((item) => (
                    <li key={item._id}>
                        <a href={`/${item.type}/${item.slug.current}`} className="text-blue-600 hover:underline">
                            {item.title}
                        </a>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
