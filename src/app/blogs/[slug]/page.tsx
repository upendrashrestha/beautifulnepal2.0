
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchPostBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import PostView from "@/components/PostView";
export const dynamic = "force-dynamic"; // Or use generateStaticParams below

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return { title: "Blog not found", description: "" };
    return generateMetadataHelper({
        title: post.title,
        description: post.excerpt || "",
        keywords: post?.categories?.map((category) => category.title).join(", "),
        openGraphImageUrl: post.mainImage && urlFor(post.mainImage.asset._ref).url(),
        author: post.author?.name
    });
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;
    const post = await fetchPostBySlug(slug);
    if (!post) return notFound();

    return (
        <PostView {...post} />
    );
}