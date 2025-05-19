
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { fetchPostBySlug } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/util/generateMetadataHelper";
import Image from "next/image";
import { Box, Chip, Container, Divider, Stack, Typography } from "@mui/material";
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
        <Container maxWidth="md" sx={{ py: 3 }}>
            {/* Title */}
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {post.title}
            </Typography>

            {/* Metadata */}
            <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" alignItems="center">
                {post.author && (
                    <Typography variant="body2" color="text.secondary">
                        By {post.author.name}
                    </Typography>
                )}
                {post.publishedAt && (
                    <Typography variant="body2" color="text.secondary">
                        {new Date(post.publishedAt).toLocaleDateString()}
                    </Typography>
                )}
                {post.categories && post.categories?.length > 0 && (
                    <Stack direction="row" spacing={1}>
                        {post.categories.map((cat) => (
                            <Chip key={cat._id} label={cat.title} size="small" />
                        ))}
                    </Stack>
                )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Main Image */}
            {post.mainImage?.asset?._ref && (
                <Box position="relative" width="100%" height={400} mb={4}>
                    <Image
                        src={urlFor(post.mainImage.asset._ref).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        style={{ objectFit: "cover", borderRadius: "12px" }}
                    />
                </Box>
            )}

            {/* Excerpt */}
            {post.excerpt && (
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontStyle="italic"
                    mb={4}
                >
                    {post.excerpt}
                </Typography>
            )}

            {/* Body */}
            <Box sx={{ "& > *": { mb: 2 } }}>
                {post.body && <PortableText value={post.body} />}
            </Box>
        </Container>
    );
}