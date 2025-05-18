"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";

export default function SearchBox() {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState<any[]>([]);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!term.trim()) return;

        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        const merged = [...data.posts, ...data.destinations, ...data.categories];
        setResults(merged);
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
                {results.map((item) => (
                    <li key={item._id}>
                        <a href={`/${item.type}/${item.slug.current}`} className="text-blue-600 hover:underline">
                            {item.title || item.name}
                        </a>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
