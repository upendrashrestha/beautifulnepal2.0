import AnimatedSection from "@/components/AnimatedSection";
import EventSubmissionForm from "@/components/events/EventSubmissionForm";
import PageLayout from "@/components/layouts/PageLayout";

import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: "Submit your events",
        description: "Planning an event in Nepal? Share it with the world!",
        keywords: "create event, share, festival, planning, festival",
    });
}

export default function SubmitEventPage() {
    return (
     <PageLayout title="Submit Your Event" className="text-center">
     
          <p className="text-md pb-10 text-gray-600 dark:text-gray-300">
            Share your upcoming event with the community in Nepal
          </p>
    
                <AnimatedSection>
                 
    <EventSubmissionForm />;
    </AnimatedSection>
    </PageLayout>)
}
