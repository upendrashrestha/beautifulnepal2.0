import { Suspense } from "react";
import ClearCacheForm from "./ClearCacheForm";

export const dynamic = "force-dynamic";

export default function ClearCachePage() {
    return (
        <main className="max-w-xl mx-auto py-16 px-4">
            <h1 className="text-2xl font-bold mb-6">Clear Sanity Cache</h1>

            <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
                <ClearCacheForm />
            </Suspense>
        </main>
    );
}
