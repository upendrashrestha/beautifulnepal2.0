"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { clearSanityCache } from "@/app/actions/clearCache";

export default function ClearCacheForm() {
    const searchParams = useSearchParams();
    const secret = searchParams.get("secret");
    const [authorized, setAuthorized] = useState(false);
    const [key, setKey] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        if (secret === process.env.NEXT_PUBLIC_ADMIN_CACHE_SECRET) {
            setAuthorized(true);
        }
    }, [secret]);

    async function handleClearCache(formData: FormData) {
        try {
            await clearSanityCache(formData);
            setStatus("success");
        } catch (err) {
            console.error("Cache clear failed", err);
            setStatus("error");
        }
    }

    if (!authorized) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl text-red-600 font-semibold">Unauthorized</h2>
                <p className="mt-2 text-gray-600">Missing or invalid access token.</p>
            </div>
        );
    }

    return (
        <form action={handleClearCache} className="space-y-4">
            <input
                type="text"
                name="key"
                placeholder="Enter cache key (leave blank to clear all)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-black dark:text-white"
            />

            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
                Clear Cache
            </button>

            {status === "success" && (
                <p className="mt-4 text-green-600">✅ Cache cleared successfully.</p>
            )}
            {status === "error" && (
                <p className="mt-4 text-red-600">❌ Failed to clear the cache.</p>
            )}
        </form>
    );
}
