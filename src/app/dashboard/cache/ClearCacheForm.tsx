"use client";

import { useState } from "react";

// All cache keys here (removed "All Keys" since we’ll handle Select All separately)
const CACHE_KEYS = [
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
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const allValues = CACHE_KEYS.map(k => k.value);
    const isAllSelected = selectedKeys.length === allValues.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedKeys([]);
        } else {
            setSelectedKeys(allValues);
        }
    };

    const toggleKey = (value: string) => {
        setSelectedKeys(prev =>
            prev.includes(value)
                ? prev.filter(k => k !== value)
                : [...prev, value]
        );
    };

    const handleClearCache = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/clear-cache", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys: selectedKeys }), // send array
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
            onSubmit={handleClearCache}
            className="space-y-4 max-w-md"
        >
            <div className="space-y-2">
                <p className="font-medium">Select Cache Keys</p>

                {/* Select All */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                    />
                    <span className="font-semibold">Select All</span>
                </label>

                {/* Individual Checkboxes */}
                {CACHE_KEYS.map((key) => (
                    <label key={key.value} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedKeys.includes(key.value)}
                            onChange={() => toggleKey(key.value)}
                        />
                        {key.label}
                    </label>
                ))}
            </div>

            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                disabled={loading || selectedKeys.length === 0}
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
