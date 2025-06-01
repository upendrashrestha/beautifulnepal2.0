
import AnimatedSection from '@/components/AnimatedSection';
import PageLayout from '@/components/layouts/PageLayout';
import Link from '@/components/Link';
import { Card, CardContent } from '@/components/ui/card';
import { fetchCommunityEvents } from '@/sanity/lib/fetch'
import { CommunityEvent } from '@/types'
import { generateMetadataHelper } from '@/utils/generateMetadataHelper';
import { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {

    return generateMetadataHelper({
        title: "What's happening in Nepal",
        description: "Explore what’s happening in Nepal — from vibrant festivals to local events, adventures, and must-see moments."
    });
}


export default async function WhatsHappeningPage() {
    const events = await fetchCommunityEvents();
    console.log("Evnets", events);

    return (
        <PageLayout title="What&apos;s Happening in Nepal">
            <AnimatedSection>
                <div className='grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    <h2 className='font-bold p-2 text-center'>Hosting an event? Share it with the world! </h2>
                    <Link
                        href="/whats-happening/submit-your-event"
                        className="inline-block text-sm px-5 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg ml-4 text-center"
                    >
                        Submit your event
                    </Link>
                </div>

            </AnimatedSection>
            {events.length === 0 ? (
                <p>No upcoming events right now. Check back soon!</p>
            ) : (
                <section className="my-16">
                    <AnimatedSection>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((event: CommunityEvent) => (
                                <Link
                                    key={event._id}
                                    href={event.slug && `/whats-happening/${event.slug.current}` || "#"}
                                    className="group rounded-lg bg-white overflow-hidden hover:shadow-md transition"
                                >
                                    <Card key={event._id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white">
                                        <CardContent className="flex flex-col justify-between p-4 w-full">
                                            <h2 className="text-xl font-semibold">
                                                {event.title}</h2>
                                            <p><strong>Event Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
                                            <p><strong>Event Time:</strong> {event.eventTime}</p>
                                            {event.location && <p><strong>Location:</strong> {event.location}</p>}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div></AnimatedSection>
                </section>

            )}
        </PageLayout>
    )
}
