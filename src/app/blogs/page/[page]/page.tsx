// app/blogs/page/[page]/page.tsx
import { fetchPaginatedPosts } from "@/sanity/lib/fetch";
import Link from "next/link";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/util/constant";
import { Post } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import { Container, Divider, Typography } from "@mui/material";

export default async function BlogPage({ params }: { params: { page: string } }) {
    const currentPage = parseInt(params.page || "1", 10);
    const { posts, total } = await fetchPaginatedPosts(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Title */}
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Blogs
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: Post) => (
                    <Link
                        key={post._id}
                        href={`/blogs/${post.slug.current}`}
                        className="group rounded-lg overflow-hidden hover:shadow-md transition"
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

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-800 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt || ""}</p>
                        </div>
                    </Link>
                ))}
            </div>


            <div className="flex justify-center items-center gap-4 mt-12">
                {currentPage > 1 && (
                    <Link rel="prev" href={`/blogs/page/${currentPage - 1}`} className="px-3 py-1 border rounded">
                        Previous
                    </Link>
                )}
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                    <Link rel="next" href={`/blogs/page/${currentPage + 1}`} className="px-3 py-1 border rounded">
                        Next
                    </Link>
                )}
            </div>
        </Container>
    );
}
