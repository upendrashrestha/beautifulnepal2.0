import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchDestinationBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";
import PageLayout from "@/components/layouts/PageLayout";
import BlockContent from "@/components/ui/blockContent";

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
    });
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const destination = await fetchDestinationBySlug(slug);

    if (!destination) return notFound();

    return (
        <PageLayout title={`Destination`}>
            <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="w-full text-center">
                    <h1 className="text-2xl text-gray-900 sm:text-2xl md:text-3xl  dark:text-white">
                        {destination.name}
                    </h1>
                </div>
                <div className="flex justify-end">
                    <SocialShare />
                </div>

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

                <div className="prose prose-gray max-w-none">
                    {destination.details && <BlockContent value={destination.details} />}
                </div>
            </article>
        </PageLayout>
    );
}
