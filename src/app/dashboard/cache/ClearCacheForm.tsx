"use client";

import Dropdown from "@/components/ui/Dropdown";
import { useState } from "react";

// All cache keys here
const CACHE_KEYS = [
    { label: "All Keys", value: "" },
    { label: "Company", value: "company" },
    { label: "Destinations", value: "destinations" },
    { label: "Posts", value: "posts" },
    { label: "Authors", value: "authors" },
    { label: "Guides", value: "guides" },
    { label: "Events", value: "events" },
    { label: "Listings", value: "listings" },
    { label: "Leads", value: "leads" },
    { label: "Clients", value: "clients" },
    { label: "Messages", value: "messages" },
    { label: "Pictures", value: "pictures" },
    { label: "Notifications", value: "notifications" },
    { label: "NotificationPreferences", value: "notification:preferences" },
];

export default function ClearCacheForm() {
    const [key, setKey] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleClearCache = async (formData: FormData) => {
        setLoading(true);
        setStatus("idle");

        try {
            const keyToClear = formData.get("cache")?.toString() || "";
            const res = await fetch("/api/clear-cache", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: keyToClear }),
            });

            const data = await res.json();

            setStatus(data.message === "success" ? "success" : "error");
        } catch (err) {
            console.error("Failed to clear cache:", err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            action={handleClearCache}
            className="space-y-4 max-w-md"
        >
            <Dropdown
                label="Select Cache Key"
                name="cache"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                options={CACHE_KEYS}
            />

            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Clearing..." : "Clear Cache"}
            </button>

            {status === "success" && (
                <p className="mt-2 text-green-600">✅ Cache cleared successfully.</p>
            )}
            {status === "error" && (
                <p className="mt-2 text-red-600">❌ Failed to clear the cache.</p>
            )}
        </form>
    );
}
