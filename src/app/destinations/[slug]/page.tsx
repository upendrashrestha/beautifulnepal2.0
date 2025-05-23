
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { fetchDestinationBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";

export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const destination = await fetchDestinationBySlug(params.slug);
    if (!destination) return { title: "Destination not found", description: "" };
    return generateMetadataHelper({
        title: destination.name,
        description: destination.intro || "",
        openGraphImageUrl: destination.heroImage && urlFor(destination.heroImage.asset._ref).url()
    });
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const destination = await fetchDestinationBySlug(params.slug);
    if (!destination) return notFound();

    return (
        <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{destination.name}</h1>
            <div className="mb-4"><SocialShare /></div>

            {destination.heroImage && (
                <div className="relative h-48 w-full">
                    <Image
                        src={urlFor(destination.heroImage.asset._ref).url()}
                        alt={destination.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-5">

                {destination.details && <PortableText value={destination.details} />}
            </div>
        </article>
    );
}