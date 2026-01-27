import EventSubmissionForm from "@/components/events/EventSubmissionForm";

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
    return <EventSubmissionForm />;
}
