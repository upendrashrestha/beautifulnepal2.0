import { fetchCommunityEvents } from '@/sanity/lib/fetch';
import { generateMetadataHelper } from '@/utils/generateMetadataHelper';
import { Metadata } from 'next';
import WhatsHappeningClient from './whatsHappeningClient';

export async function generateMetadata(): Promise<Metadata> {
    return generateMetadataHelper({
        title: "What's happening in Nepal",
        description: "Explore what’s happening in Nepal — from vibrant festivals to local events, adventures, and must-see moments.",
        keywords: "events, fesitvals, adventures, must-see, moments, vibrant, color, holidays"
    });
}

export default async function WhatsHappeningPage() {
    const events = await fetchCommunityEvents();

    return <WhatsHappeningClient events={events} />;
}

