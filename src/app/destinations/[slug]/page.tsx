
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { fetchDestinationBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const destination = await fetchDestinationBySlug(params.slug);
    if (!destination) return { title: "Destination not found", description: "" };
    return generateMetadataHelper({
        title: destination.name,
        description: destination.intro || "",
        openGraphImageUrl: destination.heroImage && urlFor(destination.heroImage.asset._ref).url()
    });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const destination = await fetchDestinationBySlug(params.slug);
    if (!destination) return notFound();

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">{destination.name}</h1>
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
            {destination.details && <PortableText value={destination.details} />}
        </div>
    );
}