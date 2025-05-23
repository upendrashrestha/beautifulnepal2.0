
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchPostsByCategory } from "@/sanity/lib/fetch";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/layouts/PageLayout";
import { Post } from "@/types";

export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    return { title: params.slug };
}


export default async function CategoriesPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const posts = await fetchPostsByCategory(params.slug);
    if (!posts) return notFound();

    return (
        <PageLayout title={params.slug}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: Post) => (
                    <Link
                        key={post._id}
                        href={`/blogs/${post.slug.current}`}
                        className="group rounded-lg bg-white overflow-hidden hover:shadow-md transition"
                    >
                        {post.mainImage && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={urlFor(post.mainImage.asset._ref).url()}
                                    alt={post.mainImage.asset.alt || post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-800 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-black text-sm line-clamp-3">{post.excerpt || ""}</p>
                        </div>
                    </Link>
                ))}
            </div>



        </PageLayout>
    );
}