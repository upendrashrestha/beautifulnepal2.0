// app/whats-happening/page.tsx
import { fetchCommunityEvents } from '@/sanity/lib/fetch';
import { generateMetadataHelper } from '@/utils/generateMetadataHelper';
import { Metadata } from 'next';
import WhatsHappeningClient from './whatsHappeningClient';

export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "What's happening in Nepal",
    description:
      "Explore what’s happening in Nepal — from vibrant festivals to local events, adventures, and must-see moments.",
    keywords:
      "events, festivals, adventures, must-see, moments, vibrant, color, holidays",
  });
}

export default async function WhatsHappeningPage() {
  // Fetch events on the server side
  const events = await fetchCommunityEvents();

  // Pass events as props to client component
  return <WhatsHappeningClient events={events} />;
}
