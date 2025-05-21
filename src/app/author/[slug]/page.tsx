
import PageLayout from "@/layouts/PageLayout";
import { fetchPostsByAuthor } from "@/sanity/lib/fetch";
import { Post } from "@/types";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function AuthorPage(props: PageProps) {
    const params = await props.params;
    const slug = params.slug;
    const posts = await fetchPostsByAuthor(slug);
    return (
        <PageLayout title="Author's Blogs">
            <ul>
                {posts.map((post: Post) => (
                    <li key={post._id} className="mb-4">
                        <a href={`/blogs/${post.slug.current}`} className="text-xl text-blue-600 underline">
                            {post.title}
                        </a>
                    </li>
                ))}
            </ul>
        </PageLayout>
    );
}