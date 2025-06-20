import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import SocialShare from "@/components/SocialShare";
import Link from "@/components/Link";
import PageLayout from "@/components/layouts/PageLayout";
import { fetchCommunityEventBySlug } from "@/sanity/lib/fetch";
import { FaRegCalendarAlt, FaRegClock, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";

import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await props.params;
    const event = await fetchCommunityEventBySlug(slug);
    if (!event) return { title: "Event not found", description: "" };
    return generateMetadataHelper({
        title: event.title,
        description: event.description || "",
        author: event.organizerName,
        openGraphImageUrl: event.image
            ? urlFor(event.image.asset._ref).url()
            : undefined,
        keywords: "event, happening now, location, city, culture, festivals"
    });
}

// Move the page to a server component and delegate rendering to a client component
interface EventPageClientProps {
    event: Awaited<ReturnType<typeof fetchCommunityEventBySlug>>;
}

function EventPageClient({ event }: EventPageClientProps) {
    if (!event) return null;

    return (
        <PageLayout title={event.title}>
            <article className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="text-center space-y-4">
                        {event.image && (
                            <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={urlFor(event.image.asset._ref).url()}
                                    alt={event.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
                            <div className="flex items-center gap-2">
                                <FaRegCalendarAlt className="text-orange-500" />
                                <span>{event.eventDate}
                                    {event.eventEndDate ? ` - ${event.eventEndDate}` : ""}
                                </span>
                            </div>
                            {event.eventTime && (
                                <div className="flex items-center gap-2">
                                    <FaRegClock className="text-blue-500" />
                                    <span>{event.eventTime}
                                        {event.eventEndTime ? ` - ${event.eventEndTime}` : ""}
                                    </span>
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <SocialShare />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-2">Organizer</h3>
                        <p><span className="font-medium text-gray-600">Name:</span> {event.organizerName}</p>
                        <p><span className="font-medium text-gray-600">Email:</span> {event.organizerEmail}</p>
                    </div>

                    {event.website && (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">Website</h3>
                            <Link
                                href={event.website}
                                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                            >
                                <FaGlobe /> {event.website}
                            </Link>
                        </div>
                    )}
                </div>

                {event.description && (
                    <div className="prose prose-lg text-gray-800 max-w-none mb-10">
                        {event.description}
                    </div>
                )}
            </article>
        </PageLayout>
    );
}

export default async function EventPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const event = await fetchCommunityEventBySlug(slug);
    if (!event) return notFound();

    return <EventPageClient event={event} />;
}
