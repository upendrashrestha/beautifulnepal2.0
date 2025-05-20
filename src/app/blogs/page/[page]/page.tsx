// app/blogs/page/[page]/page.tsx
import { fetchPaginatedPosts } from "@/sanity/lib/fetch";
import { ITEM_PER_PAGE } from "@/util/constant";
import Pagination from "@/components/Pagination";
import PageTitle from "@/components/PageTitle";
import { Post } from "@/types";
import Link from "@/components/Link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default async function BlogPage(props: { params: Promise<{ page: string }> }) {
    const params = await props.params;
    const currentPage = parseInt(params.page || "1", 10);
    const { posts, total } = await fetchPaginatedPosts(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <div>
            <PageTitle>Blogs</PageTitle>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: Post) => (
                    <Link
                        key={post._id}
                        href={`/blogs/${post.slug.current}`}
                        className="group rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                        {post.mainImage && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={urlFor(post.mainImage.asset._ref).url()}
                                    alt={post.mainImage.alt || post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-5">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt || ""}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12">
                    <Pagination pageName="blogs" currentPage={currentPage} totalPages={totalPages} />
                </div>
            )}
        </div>

    );
}
