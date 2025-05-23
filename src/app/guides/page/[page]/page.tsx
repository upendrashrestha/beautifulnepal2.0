// app/blogs/page/[page]/page.tsx
import { fetchPaginatedGuides } from "@/sanity/lib/fetch";
import Link from "next/link";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/utils/constant";
import { Guide } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import Pagination from "@/components/Pagination";
import PageLayout from "@/components/layouts/PageLayout";

export default async function GuidePage(props: { params: Promise<{ page: string }> }) {
    const params = await props.params;
    const currentPage = parseInt(params.page || "1", 10);
    const { guides, total } = await fetchPaginatedGuides(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <PageLayout title="Guides">
            <div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {guides.map((guide: Guide) => (
                        <Link
                            key={guide._id}
                            href={`/guides/${guide.slug.current}`}
                            className="group overflow-hidden transition"
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
                                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                    {guide.title}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination pageName="guides" currentPage={currentPage} totalPages={totalPages} />
                    </div>
                )}
            </div>
        </PageLayout>

    );
}
