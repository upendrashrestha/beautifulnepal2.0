
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchPostsByCategory } from "@/sanity/lib/fetch";
import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    return { title: params.slug };
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const posts = await fetchPostsByCategory(params.slug);
    if (!posts) return notFound();

    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">{params.slug}</h1>

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



        </div>
    );
}