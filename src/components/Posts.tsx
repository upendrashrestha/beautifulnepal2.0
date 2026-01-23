// components/Posts.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/types";
import { Card, CardContent } from "./ui/card";
import AnimatedSection from "./AnimatedSection";

interface PostsProps {
  posts: Post[]; // ✅ Receive posts as prop
  title?: string;
}

export default function Posts({ posts, title }: PostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-10 mt-10">
      <AnimatedSection>
        {title && (
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
        )}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const mainImageUrl = post.mainImage?.asset?._ref
              ? urlFor(post.mainImage.asset._ref).width(600).height(400).url()
              : "/placeholder.jpg";

            const mainImageAlt = post.mainImage?.asset?.alt || post.title;

            return (
              <Card
                key={post._id}
                className="group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl"
              >
                <Link href={`/blogs/${post.slug.current}`}>
                  <div className="relative h-52 w-full">
                    <Image
                      src={mainImageUrl}
                      alt={mainImageAlt}
                      fill
                      className="rounded-t-2xl object-cover"
                      priority={index < 3} // first 3 images are priority
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
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
