
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
import Image from '@/components/Image'
import { Post } from "@/types";
export const dynamic = "force-dynamic"; // Or use generateStaticParams below

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return { title: "Blog not found", description: "" };
    return generateMetadataHelper({
        title: post.title,
        description: post.excerpt || "",
        keywords: post?.categories?.map((category) => category.title).join(", "),
        openGraphImageUrl: post?.imageURL ?? undefined,
        author: post.author?.name
    });
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return notFound();

    return (
        <PostView {...post} />
    );
}

function PostView(post: Post) {
    return (
        <SectionContainer>
            <article>
                <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
                    <header className="pt-6 xl:pb-6">
                        <div className="space-y-1 text-center">
                            <dl className="space-y-10">
                                <div>
                                    <dt className="sr-only">Published on</dt>
                                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                                        <time dateTime={post.publishedAt ?? ''}>
                                            {post.publishedAt
                                                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : 'Unknown date'
                                            }
                                        </time>
                                    </dd>
                                    <dt className="sr-only">Category</dt>
                                    <dd>
                                        <ul>
                                            {post.categories?.map((x, i) => (
                                                <li key={i}>{x.title}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            </dl>
                            <div>
                                <PageTitle>{post.title}</PageTitle>
                            </div>
                        </div>
                    </header>
                    <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
                        <div className="p-4 xl:border-b xl:border-gray-200  xl:dark:border-gray-700">

                            <div className="flex items-center gap-x-4">
                                <Image
                                    src={post.author?.image?.asset?._ref ? urlFor(post.author.image.asset._ref).url() : ""}
                                    alt=""
                                    className="h-8 w-8 rounded-full bg-gray-50"
                                    width={32}
                                    height={32}
                                />
                                <div className="text-sm">
                                    <p>Written By</p>
                                    <Link href={`/author/${post.author?.slug.current}`}
                                        className="font-semibold text-gray-900">{post.author?.name}</Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-4 pt-6">
                                <SocialShare />
                            </div>

                        </div>

                        {post.body &&
                            <div className="xl:col-span-3 xl:row-span-2 xl:pb-0 ">
                                {/* Main Image */}
                                {post.mainImage?.asset?._ref && (
                                    <Image
                                        src={post.mainImage?.asset._ref ? urlFor(post.mainImage.asset._ref).url() : ""}
                                        alt={post.mainImage?.asset?.alt || post.title}
                                        height={500}
                                        width={500}
                                        style={{ objectFit: "cover" }}
                                    />
                                )}
                                <div className="prose dark:prose-invert max-w-none pt-10 pb-8"><PortableText value={post.body} />
                                </div>

                            </div>
                        }
                        <footer>
                            <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">

                            </div>
                            <div className="pt-4 xl:pt-8">
                                <Link
                                    href={`/blogs`}
                                    className="text-primary-500 hover:text-primary-600 hover:font-bold"
                                    aria-label="Back to the blogs"
                                >
                                    &larr; Back to the blogs
                                </Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </article>
        </SectionContainer>
    )
}