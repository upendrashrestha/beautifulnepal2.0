
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchPostBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import Image from "next/image";
import { PageProps } from "@/types";
export const dynamic = "force-dynamic"; // Or use generateStaticParams below


export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return { title: "Blog not found", description: "" };
    return generateMetadataHelper({
        title: post.title,
        description: post.excerpt || "",
        keywords: post?.categories?.map((category) => category.title).join(", "),
        openGraphImageUrl: post.mainImage && urlFor(post.mainImage.asset._ref).url(),
        author: post.author?.name
    });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return notFound();

    return (
        <article className="max-w-4xl mx-auto p-6 lg:p-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800 mb-4">
                {post.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                {post.author && <p>By {post.author.name}</p>}
                {post.publishedAt && (
                    <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
                )}
                {post.categories && post.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map((cat) => (
                            <span
                                key={cat._id}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                            >
                                {cat.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Image */}
            {post.mainImage?.asset?._ref && (
                <div className="relative w-full h-80 md:h-[500px] mb-8 overflow-hidden rounded-xl">
                    <Image
                        src={urlFor(post.mainImage.asset._ref).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
                <p className="text-lg text-gray-700 italic mb-8">{post.excerpt}</p>
            )}

            {/* Body */}
            <div className="prose max-w-none prose-lg prose-gray">
                {post.body && <PortableText value={post.body} />}
            </div>
        </article>
    );
}