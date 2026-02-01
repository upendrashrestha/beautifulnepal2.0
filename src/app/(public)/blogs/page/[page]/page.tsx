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
import AnimatedSection from "@/components/AnimatedSection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Travel Stories from Nepal | BeautifulNepal",
    description:
      "Read inspiring travel stories from Nepal — real experiences, local culture, hidden places, and unforgettable journeys shared by travelers and locals.",
    keywords: [
      "Nepal travel stories",
      "Nepal travel blog",
      "BeautifulNepal stories",
      "travel experiences in Nepal",
      "Nepal culture stories",
    ],
    openGraph: {
      title: "Travel Stories from Nepal | BeautifulNepal",
      description:
        "Discover authentic travel stories from Nepal, featuring culture, adventure, people, and unforgettable moments.",
      url: "https://beautifulnepal.com/stories",
      siteName: "BeautifulNepal",
      images: [
        {
          url: "https://beautifulnepal.com/og/stories.jpg",
          width: 1200,
          height: 630,
          alt: "Travel stories from Nepal",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Travel Stories from Nepal | BeautifulNepal",
      description:
        "Authentic travel stories and experiences from across Nepal.",
      images: ["https://beautifulnepal.com/og/stories.jpg"],
    },
    alternates: {
      canonical: "https://beautifulnepal.com/stories",
    },
  };
}


interface Props {
  params: Promise<{ page: string }>;
}

// Mark as server component (async)
export default async function BlogPage({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page || "1", 10);
  const { posts, total } = await fetchPaginatedPosts(currentPage);
  const totalPages = Math.ceil(total / ITEM_PER_PAGE);

  return (
    <PageLayout title="Blogs">
      <AnimatedSection>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              pageName="blogs"
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </AnimatedSection>
    </PageLayout>
  );
}

// ----------------------
// Post Card Component
// ----------------------
function PostCard({ post }: { post: Post }) {
  const postImageUrl = post.mainImage?.asset._ref
    ? urlFor(post.mainImage.asset._ref).width(600).height(400).url()
    : "/placeholder.jpg";

  const authorImageUrl = post.author?.image?.asset?._ref
    ? urlFor(post.author.image.asset._ref).width(32).height(32).url()
    : "/avatar-placeholder.png";

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Unknown date";

  return (
    <Card className="overflow-hidden border-0 transition-transform duration-300 hover:scale-105 group">
      <Link href={`/blogs/${post.slug.current}`}>
        <div className="relative h-48 w-full">
          <Image
            src={postImageUrl}
            alt={post.mainImage?.asset?.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="mb-2 font-cal text-lg leading-6 text-black group-hover:text-gray-700">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-900">
            {post.excerpt || ""}
          </p>
          <div className="flex items-center gap-x-4">
            <Image
              src={authorImageUrl}
              alt={post.author?.name ?? ""}
              className="h-8 w-8 rounded-full bg-gray-50"
              width={32}
              height={32}
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{post.author?.name}</p>
              <time dateTime={post.publishedAt ?? ""}>{publishedDate}</time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
