import { Suspense } from 'react';
import CreateLead from './CreateLead';
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import AnimatedSection from '@/components/AnimatedSection';
import PageLayout from '@/components/layouts/PageLayout';

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: "Plan Your Trip to Nepal | Free Travel Planning by Local Experts",
        description:
            "Plan your trip to Nepal for free. Share your travel details and get personalized itineraries, trekking plans, and expert help from trusted local Nepali travel agencies — safe, smooth, and unforgettable.",
        keywords:
            "plan your trip to Nepal, Nepal trip planner, free Nepal itinerary, Nepal travel planning, Nepal trekking planning, local Nepali travel agencies, visit Nepal, Nepal tour planning",
    });
}

export default function Page() {
    return (
        <PageLayout title="Plan Your Trip" className="text-center">

            <AnimatedSection>
                <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
                    <CreateLead />
                </Suspense>
            </AnimatedSection>
        </PageLayout>
    );
}
