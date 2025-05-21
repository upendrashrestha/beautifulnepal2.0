
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchGuideBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";
export const dynamic = "force-dynamic"; // Or use generateStaticParams below


export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const guide = await fetchGuideBySlug(slug);
    if (!guide) return { title: "Blog not found", description: "" };
    return generateMetadataHelper({
        title: guide.title,
        description: guide.excerpt || "",
        openGraphImageUrl: guide.mainImage && urlFor(guide.mainImage.asset._ref).url(),
        author: guide.author?.name
    });
}

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;
    const guide = await fetchGuideBySlug(slug);
    if (!guide) return notFound();

    return (
        <article className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800 mb-4">
                {guide.title}
            </h1>
            <div className="mb-4">
                <SocialShare />
            </div>
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                {guide.author && <p>By {guide.author.name}</p>}
                {guide.publishedAt && (
                    <p>{new Date(guide.publishedAt).toLocaleDateString()}</p>
                )}
                {guide.destination && (
                    <p>Destination: {guide.destination.name}</p>
                )}
            </div>

            {/* Main Image */}
            {guide.mainImage?.asset?._ref && (
                <div className="relative w-full h-80 md:h-[500px] mb-8 overflow-hidden rounded-xl">
                    <Image
                        src={urlFor(guide.mainImage.asset._ref).url()}
                        alt={guide.mainImage.alt || guide.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Excerpt */}
            {guide.excerpt && (
                <p className="text-lg text-gray-700 italic mb-8">{guide.excerpt}</p>
            )}

            {/* Body */}
            <div className="prose max-w-none prose-lg prose-gray">
                {guide.body && <PortableText value={guide.body} />}
            </div>
        </article>
    );
}