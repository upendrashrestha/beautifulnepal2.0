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
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">Authors Blogs</h1>
            <ul>
                {posts.map((post: Post) => (
                    <li key={post._id} className="mb-4">
                        <a href={`/blogs/${post.slug.current}`} className="text-xl text-blue-600 underline">
                            {post.title}
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    );
}