// app/blogs/page/[page]/page.tsx
import { fetchPaginatedPosts } from "@/sanity/lib/fetch";
import { ITEM_PER_PAGE } from "@/utils/constant";
import Pagination from "@/components/Pagination";
import Link from "@/components/Link";
import Image from "next/image";
import PageLayout from "@/components/layouts/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/types";

export default async function BlogPage(props: { params: Promise<{ page: string }> }) {
    const params = await props.params;
    const currentPage = parseInt(params.page || "1", 10);
    const { posts, total } = await fetchPaginatedPosts(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <PageLayout title="Blogs">

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: Post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12">
                    <Pagination pageName="blogs" currentPage={currentPage} totalPages={totalPages} />
                </div>
            )}
        </PageLayout>

    );
}

function PostCard({ post }: { post: Post }) {
    return (
        <Card className="overflow-hidden border-0 transition-transform duration-300 hover:scale-105">
            <Link href={`/blogs/${post.slug.current}`}>
                <div className="relative h-48 w-full">
                    <Image
                        src={post.mainImage?.asset._ref ? urlFor(post.mainImage.asset._ref).url() : ""}
                        alt={post.mainImage?.asset?.alt || post.title}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <CardContent className="pt-4">
                    <h3 className="mb-2 font-cal text-lg leading-6 text-gray-900 group-hover:text-gray-600">
                        {post.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                        {post.excerpt || ""}
                    </p>
                    <div className="flex items-center gap-x-4">
                        <Image
                            src={post.author?.image?.asset?._ref ? urlFor(post.author.image.asset._ref).url() : ""}
                            alt=""
                            className="h-8 w-8 rounded-full bg-gray-50"
                            width={32}
                            height={32}
                        />
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">{post.author?.name}</p>
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
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
