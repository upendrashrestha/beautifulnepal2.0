// app/blogs/page/[page]/page.tsx
import { fetchPaginatedGuides } from "@/sanity/lib/fetch";
import Link from "next/link";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/utils/constant";
import { Guide } from "../../../../../../types";
import { urlFor } from "@/sanity/lib/image";
import Pagination from "@/components/Pagination";
import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Nepal Travel Guides & Tips | BeautifulNepal",
        description:
            "Explore expert travel guides for Nepal — trekking routes, city guides, travel tips, itineraries, and everything you need to plan the perfect trip.",
        keywords: [
            "Nepal travel guide",
            "Nepal trekking guide",
            "Nepal itinerary",
            "Nepal travel tips",
            "BeautifulNepal guides",
        ],
        openGraph: {
            title: "Nepal Travel Guides & Tips | BeautifulNepal",
            description:
                "Plan your Nepal journey with detailed travel guides, itineraries, trekking tips, and local insights.",
            url: "https://beautifulnepal.com/guides",
            siteName: "BeautifulNepal",
            images: [
                {
                    url: "https://beautifulnepal.com/og/guides.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Nepal travel guides and tips",
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Nepal Travel Guides & Tips | BeautifulNepal",
            description:
                "Detailed travel guides and itineraries to help you explore Nepal.",
            images: ["https://beautifulnepal.com/og/guides.jpg"],
        },
        alternates: {
            canonical: "https://beautifulnepal.com/guides",
        },
    };
}

export default async function GuidePage(props: { params: Promise<{ page: string }> }) {
    const params = await props.params;
    const currentPage = parseInt(params.page || "1", 10);
    const { guides, total } = await fetchPaginatedGuides(currentPage);

    const totalPages = Math.ceil(total / ITEM_PER_PAGE);

    return (
        <PageLayout title="Guides">
            <AnimatedSection>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {guides.map((guide: Guide) => (
                        <Link
                            key={guide._id}
                            href={`/guides/${guide.slug.current}`}
                            className="group rounded-lg bg-white overflow-hidden hover:shadow-md transition"
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
            </AnimatedSection>
        </PageLayout>

    );
}
