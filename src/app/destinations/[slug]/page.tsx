import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchDestinationBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";
import PageLayout from "@/components/layouts/PageLayout";
import BlockContent from "@/components/ui/blockContent";
import Posts from "@/components/Posts";
import Guides from "@/components/Guides";

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await props.params;
    const destination = await fetchDestinationBySlug(slug);

    if (!destination) {
        return { title: "Destination not found", description: "" };
    }

    return generateMetadataHelper({
        title: destination.name,
        description: destination.intro || "",
        openGraphImageUrl: destination.heroImage
            ? urlFor(destination.heroImage.asset._ref).url()
            : undefined,
        keywords: "destination, explore, location, city, village, local, experience"
    });
}

export default async function DestinationPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const destination = await fetchDestinationBySlug(slug);

    if (!destination) return notFound();

    return (
        <PageLayout title={destination.name}>
            <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <SocialShare />
                {destination.heroImage && (
                    <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden shadow-sm">
                        <Image
                            src={urlFor(destination.heroImage.asset._ref).url()}
                            alt={destination.name}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="mb-20 prose prose-gray max-w-none">
                    {destination.details && <BlockContent value={destination.details} />}
                </div>
                <div className="divide-b divide-gray-200 dark:xl:divide-gray-700">
                    <Guides destinationSlug={destination.slug.current} title="Guides" />
                    <Posts destinationSlug={destination.slug.current} title="Related Blogs" />
                </div>
            </article>
        </PageLayout>
    );
}
