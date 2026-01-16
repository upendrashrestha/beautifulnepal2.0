"use client";
import Dropdown from "@/components/ui/Dropdown";
import { useState } from "react";

export default function ClearCacheForm() {
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error" | "unauthorized">("idle");



    async function handleClearCache(formData: FormData) {
        setLoading(true);
        const key = formData.get("key")?.toString();
        const res = await fetch("/api/clear-cache", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
        });

        const data = await res.json();
        setStatus(data.message);
        setLoading(false);
    }



    return (
        <form action={handleClearCache} className="space-y-4">
        
 <Dropdown
                label="Select Cache Key"
                value={key}
                onChange={value => {
                    setKey( value);
                }}
                options={[
                    { label: 'All Keys', value: '' },
                    { label: 'Company', value: 'company' },
                    { label: 'Destinations', value: 'destinations' },
                    { label: 'Posts', value: 'posts' },
                    { label: 'Authors', value: 'authors' },
                    { label: 'Guides', value: 'guides' },
                ]}
            />

            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                disabled={loading}
            >
                Clear Cache
            </button>
            {loading && <p>Clearing cache...</p>}
            {status === "success" && (
                <p className="mt-4 text-green-600">✅ Cache cleared successfully.</p>
            )}
            {status === "error" && (
                <p className="mt-4 text-red-600">❌ Failed to clear the cache.</p>
            )}
            {status === "unauthorized" && (
                <p className="mt-4 text-red-600">❌ Unauthorized to clear the cache.</p>
            )}
        </form>
    );
}
