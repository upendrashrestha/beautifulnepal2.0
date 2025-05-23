
import PageLayout from "@/components/layouts/PageLayout";
import { fetchAuthorBySlug, fetchPostsByAuthor } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/types";
import Image from '@/components/Image';
import { PortableText } from "next-sanity";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const author = await fetchAuthorBySlug(slug);
    if (!author) return { title: "Author not found", description: "" };
    return generateMetadataHelper({
        title: author.name,
        description: author.bio ? author.bio[0].children[0].text : "",
        openGraphImageUrl: author.image?.asset.url ?? undefined,
        author: author.name
    });
}

export default async function AuthorPage(props: PageProps) {
    const params = await props.params;
    const slug = params.slug;
    const posts = await fetchPostsByAuthor(slug);
    const author = await fetchAuthorBySlug(slug);
    return (
        <PageLayout title={`Author Detail - ${author.name}`}>
            <div className="w-full flex items-center">
                <Image
                    src={author.image?.asset?._ref ? urlFor(author.image.asset._ref).url() : ""}
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-50"
                    width={32}
                    height={32}
                />
                <div className="text-md">
                    <p>{author.name}</p>

                </div>
            </div>
            <div className={"my-4"}>{author.bio &&
                <PortableText value={author.bio} />}
            </div>
            <h2 className="text-2xl font-bold py-4">Author Blogs</h2>
            <ul>
                {posts.map((post: Post) => (
                    <li key={post._id} className="mb-4">
                        <a href={`/ blogs / ${post.slug.current} `} className="text-xl text-blue-600 underline">
                            {post.title}
                        </a>
                    </li>
                ))}
            </ul>
        </PageLayout>
    );
}