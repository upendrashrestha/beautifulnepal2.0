// app/blogs/page/[page]/page.tsx
import { fetchPaginatedGuides } from "@/sanity/lib/fetch";
import Link from "next/link";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/util/constant";
import { Guide } from "@/types";
import { urlFor } from "@/sanity/lib/image";

export default async function GuidePage({ params }: { params: { page: string } }) {
    const currentPage = parseInt(params.page || "1", 10);
    const { guides, total } = await fetchPaginatedGuides(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">Guides</h1>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide: Guide) => (
                    <Link
                        key={guide._id}
                        href={`/guides/${guide.slug.current}`}
                        className="group rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                        {guide.mainImage && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={urlFor(guide.mainImage.asset._ref).url()}
                                    alt={guide.mainImage.alt || guide.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-800 transition-colors">
                                {guide.title}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3">{guide.excerpt || ""}</p>
                        </div>
                    </Link>
                ))}
            </div>


            <div className="flex justify-center items-center gap-4 mt-12">
                {currentPage > 1 && (
                    <Link rel="prev" href={`/blogs/page/${currentPage - 1}`} className="px-3 py-1 border rounded">
                        Previous
                    </Link>
                )}
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                    <Link rel="next" href={`/blogs/page/${currentPage + 1}`} className="px-3 py-1 border rounded">
                        Next
                    </Link>
                )}
            </div>
        </div>
    );
}
