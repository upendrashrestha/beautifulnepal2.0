// import { fetchPosts } from "@/sanity/lib/fetch";
// import { Post } from "@/types";
// import { Metadata } from "next";
// import Link from "next/link";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";

// export async function generateMetadata(): Promise<Metadata> {
//     return { title: "Blog", description: "Blogs " };
// }


// export default async function BlogPage() {
//     const posts = await fetchPosts();
//     return (
//         <div className="w-full p-6">
//             <h1 className="text-3xl font-bold mb-5 text-center">Blog</h1>

//             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//                 {posts.map((post: Post) => (
//                     <Link
//                         key={post._id}
//                         href={`/blogs/${post.slug.current}`}
//                         className="group rounded-lg overflow-hidden hover:shadow-md transition"
//                     >
//                         {post.mainImage && (
//                             <div className="relative h-48 w-full">
//                                 <Image
//                                     src={urlFor(post.mainImage.asset._ref).url()}
//                                     alt={post.mainImage.alt || post.title}
//                                     fill
//                                     className="object-cover"
//                                 />
//                             </div>
//                         )}

//                         <div className="p-4">
//                             <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-800 transition-colors">
//                                 {post.title}
//                             </h2>
//                             <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt || ""}</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>

//         </div >
//     );
// }

// app/blogs/page.tsx
import { redirect } from "next/navigation";

export default function BlogsRedirectPage() {
    redirect("/blogs/page/1");
}