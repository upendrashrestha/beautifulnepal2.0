import { Suspense } from 'react';
import CreateLead from './CreateLead';
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: "Plan Your Trip",
        description: "Share your travel details and we'll connect you with the best local travel agencies to help you plan your trip to Nepal. This service is completely free — we’re here to help make your visit smooth, safe, and unforgettable",
        keywords: "plan your trip, nepal, free itinerary, vist nepal, plan for us, free planning, trek , nepali travel agencies, local agencies",
    });
}
export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <CreateLead />
        </Suspense>
    );
}
