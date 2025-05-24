import PageLayout from "@/components/layouts/PageLayout";
import { fetchAuthorBySlug, fetchPostsByAuthor } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/types";
import Image from '@/components/Image';
import { PortableText } from "next-sanity";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";

type PageProps = {
    params: Promise<{ slug: string }>;
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
        <PageLayout title={`Author - ${author.name}`}>
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6 mb-10">
                    <Image
                        src={
                            author.image?.asset?._ref
                                ? urlFor(author.image.asset._ref).width(150).height(150).url()
                                : "/placeholder-avatar.png"
                        }
                        alt={author.name}
                        className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow"
                        width={150}
                        height={150}
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                        {author.bio && (
                            <div className="prose prose-gray max-w-none text-gray-700">
                                <PortableText value={author.bio} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Blog Posts Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                        Articles by {author.name}
                    </h2>
                    <ul className="space-y-4">
                        {posts.map((post: Post) => (
                            <li key={post._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4">
                                <a
                                    href={`/blogs/${post.slug.current}`}
                                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                    {post.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </PageLayout>
    );
}
