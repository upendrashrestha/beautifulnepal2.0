
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchGuideBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";
import Link from "@/components/Link";
import PageLayout from "@/components/layouts/PageLayout";
import BlockContent from "@/components/ui/blockContent";
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

    return (<PageLayout title={`Guide - ${guide.title}`}>
        <article className="max-w-5xl mx-auto">
            <div className="mb-4">
                <SocialShare />
            </div>
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                {guide.author && <Link className="hover:text-black" href={`/author/${guide.author.slug?.current}`}>By {guide.author.name}</Link>}
                {guide.publishedAt && (
                    <p>{new Date(guide.publishedAt).toLocaleDateString()}</p>
                )}
                {guide.destination && (
                    <p>Destination: <Link className="hover:text-black" href={`/destinations/${guide.destination.slug?.current}`}>{guide.destination.name}</Link></p>
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
                {guide.body && <BlockContent value={guide.body} />}
            </div>
        </article>
    </PageLayout>
    );
}