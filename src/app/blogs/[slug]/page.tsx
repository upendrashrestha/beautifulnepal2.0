import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchPostBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import PageTitle from "@/components/PageTitle";
import SectionContainer from "@/components/SectionContainer";
import SocialShare from "@/components/SocialShare";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Link from "next/link";
import Image from '@/components/Image';
import { Post } from "@/types";

export const dynamic = "force-dynamic"; // or use generateStaticParams

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { slug } = await props.params;
    const post = await fetchPostBySlug(slug);

    if (!post) return { title: "Blog not found", description: "" };

    return generateMetadataHelper({
        title: post.title,
        description: post.excerpt || "",
        keywords: post.categories?.map(c => c.title).join(", "),
        openGraphImageUrl: post.imageURL ?? undefined,
        author: post.author?.name,
    });
}

export default async function BlogPostPage(props: PageProps) {
    const { slug } = await props.params;
    const post = await fetchPostBySlug(slug);

    if (!post) return notFound();

    return <PostView {...post} />;
}

function PostView(post: Post) {
    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown date";

    return (
        <SectionContainer>
            <article className="xl:divide-y xl:divide-gray-200 dark:xl:divide-gray-700">
                {/* Header */}
                <header className="pt-6 xl:pb-6">
                    <div className="space-y-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={post.publishedAt ?? ""}>{formattedDate}</time>
                            {Array.isArray(post.categories) && post.categories.length > 0 && (
                                <ul className="flex justify-center gap-2 mt-2 text-xs text-gray-400">
                                    {post.categories.map((cat, i) => (
                                        <li key={i}>{cat.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <PageTitle>{post.title}</PageTitle>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-6 divide-y xl:divide-y-0 divide-gray-200 dark:divide-gray-700 pb-8">
                    {/* Sidebar */}
                    <aside className="p-4 xl:border-b xl:border-gray-200 xl:dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-6">
                            <Image
                                src={
                                    post.author?.image?.asset?._ref
                                        ? urlFor(post.author.image.asset._ref).url()
                                        : ""
                                }
                                alt={post.author?.name ?? "Author"}
                                className="h-10 w-10 rounded-full bg-gray-100"
                                width={40}
                                height={40}
                            />
                            <div className="text-sm">
                                <p className="text-gray-500">Written By</p>
                                <Link
                                    href={`/author/${post.author?.slug.current}`}
                                    className="font-semibold text-gray-900 dark:text-white hover:underline"
                                >
                                    {post.author?.name}
                                </Link>
                            </div>
                        </div>
                        <SocialShare />
                    </aside>

                    {/* Main Body */}
                    {post.body && (
                        <section className="xl:col-span-3 xl:row-span-2 xl:pb-0 pt-6 xl:pt-0">
                            {/* Main Image */}
                            {post.mainImage?.asset?._ref && (
                                <div className="mb-8">
                                    <Image
                                        src={urlFor(post.mainImage.asset._ref).url()}
                                        alt={post.mainImage?.asset?.alt || post.title}
                                        width={1000}
                                        height={500}
                                        className="rounded-lg object-cover w-full p-12"
                                    />
                                </div>
                            )}

                            {/* PortableText body */}
                            <div className="prose dark:prose-invert max-w-none">
                                <PortableText value={post.body} />
                            </div>
                        </section>
                    )}

                    {/* Footer */}
                    <footer className="pt-6 xl:pt-10 xl:col-start-1 xl:row-start-2">
                        <Link
                            href="/blogs"
                            className="text-primary-600 hover:underline text-sm font-medium"
                            aria-label="Back to the blogs"
                        >
                            ← Back to the blogs
                        </Link>
                    </footer>
                </div>
            </article>
        </SectionContainer>
    );
}
