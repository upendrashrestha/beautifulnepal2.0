"use client";

import { Suspense, useEffect, useState } from "react";
import { clearSanityCache } from "@/app/actions/clearCache";
import { useSearchParams } from "next/navigation";

export default function ClearCachePage() {
    const searchParams = useSearchParams();
    const [authorized, setAuthorized] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [key, setKey] = useState("");

    const secret = searchParams.get("secret");

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
            <main className="text-center py-20">
                <h2 className="text-xl text-red-600 font-semibold">Unauthorized</h2>
                <p className="mt-2 text-gray-600">Missing or invalid access token.</p>
            </main>
        );
    }

    return (
        <main className="max-w-xl mx-auto py-16 px-4">
            <h1 className="text-2xl font-bold mb-6">Clear Sanity Cache</h1>
            <Suspense fallback={<p className="text-gray-600">Loading...</p>}>
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
                </form>
            </Suspense>
            {status === "success" && (
                <p className="mt-4 text-green-600">✅ Cache cleared successfully.</p>
            )}
            {status === "error" && (
                <p className="mt-4 text-red-600">❌ Failed to clear the cache.</p>
            )}
        </main>
    );
}
