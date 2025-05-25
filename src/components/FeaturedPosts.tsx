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
        <section className="my-16">
            <div className="flex items-center gap-2 mb-6">
                <FaStar className="text-black-500" />
                <h2 className="text-2xl font-semibold text-black">Featured</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card
                        key={post._id}
                        className="overflow-hidden border-0 shadow-md transition-transform duration-300 hover:scale-105"
                    >
                        <Link href={`/blogs/${post.slug.current}`}>
                            <div className="relative h-48 w-full">
                                <Image
                                    src={
                                        post.mainImage?.asset?._ref
                                            ? urlFor(post.mainImage.asset._ref).url()
                                            : "/placeholder.jpg"
                                    }
                                    alt={post.mainImage?.asset.alt || post.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <CardContent className="pt-4">
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h3>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </section>
    );
}
