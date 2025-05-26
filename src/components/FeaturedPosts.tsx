"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/types";
import { fetchFeaturedPosts } from "@/sanity/lib/fetch";
import { Card, CardContent } from "./ui/card";
import { FaStar } from "react-icons/fa";

export default function FeaturedPost() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function loadPosts() {
            const data = await fetchFeaturedPosts();
            setPosts(data || []);
        }
        loadPosts();
    }, []);

    if (!posts.length) return null;

    return (
        <section className="my-20 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
                <FaStar className="text-yellow-500 text-xl" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Featured Posts
                </h2>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card
                        key={post._id}
                        className="group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl"
                    >
                        <Link href={`/blogs/${post.slug.current}`}>
                            <div className="relative h-52 w-full">
                                <Image
                                    src={
                                        post.mainImage?.asset?._ref
                                            ? urlFor(post.mainImage.asset._ref).url()
                                            : "/placeholder.jpg"
                                    }
                                    alt={post.mainImage?.asset.alt || post.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-2xl object-cover"
                                />
                            </div>
                            <CardContent className="p-5">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                )}
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </section>
    );
}
