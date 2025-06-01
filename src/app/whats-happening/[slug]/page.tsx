
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import SocialShare from "@/components/SocialShare";
import Link from "@/components/Link";
import PageLayout from "@/components/layouts/PageLayout";
import { fetchCommunityEventBySlug } from "@/sanity/lib/fetch";
import PageTitle from "@/components/PageTitle";
export const dynamic = "force-dynamic"; // Or use generateStaticParams below


export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const event = await fetchCommunityEventBySlug(slug);
    if (!event) return { title: "Blog not found", description: "" };
    return generateMetadataHelper({
        title: event.title,
        description: event.description || "",
        author: event.organizerName
    });
}

export default async function EventPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;
    const event = await fetchCommunityEventBySlug(slug);
    if (!event) return notFound();

    return (<PageLayout title={``}>
        <article className="max-w-5xl mx-auto">
            <div className="mb-4">
                <SocialShare />
            </div>
            <PageTitle className="text-center">{event.title}</PageTitle>
            <div className="flex flex-wrap items-center gap-4 text-md text-gray-500 mb-6">
                <div className="p-2">
                    <strong>Organizer Detail</strong>
                    <p><strong>Name:</strong> {event.organizerName}</p>
                    <p><strong>Email:</strong> {event.organizerEmail} </p>
                </div>
                <div className="p-2">
                    {event.website && <><strong>Website: </strong><Link href={event.website}>{event.website}</Link></>}
                </div>
                <div className="p-2">
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Date:</strong> {event.eventDate}</p>
                    {event.eventTime && <p><strong>Time:</strong> {event.eventTime}</p>}
                </div>
            </div>
            {event.description && (
                <p className="text-lg text-gray-700 mb-8">{event.description}</p>
            )}

        </article>
    </PageLayout>
    );
}