// components/Posts.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "../../types";
import { Card, CardContent } from "./ui/card";
import AnimatedSection from "./AnimatedSection";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";

interface PostsProps {
  posts: Post[];
  title?: string;
}

export default function Posts({ posts, title }: PostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-10 mt-10">
      <AnimatedSection>
        {title && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const mainImageUrl = post.mainImage?.asset?._ref
              ? urlFor(post.mainImage.asset._ref).width(600).height(400).url()
              : "/placeholder.jpg";

            const mainImageAlt = post.mainImage?.asset?.alt || post.title;

            return (
              <Card
                key={post._id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl hover:-translate-y-2"
              >
                <Link href={`/blogs/${post.slug.current}`}>
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={mainImageUrl}
                      alt={mainImageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm group-hover:gap-3 transition-all">
                      <span>Read More</span>
                      <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* View All Posts Link */}
        <div className="flex justify-center mt-12">
         <Link
  href="/blogs"
  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bc1c2b] to-[#d93344] text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#bc1c2b]/25 hover:scale-105 active:scale-95 overflow-hidden"
>
  <span className="relative z-10 flex items-center gap-2">
    <FaBookOpen className="w-4 h-4" />
    View All Stories
    <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  </span>
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/20 to-transparent" />
</Link>
        </div>
      </AnimatedSection>
    </section>
  );
}