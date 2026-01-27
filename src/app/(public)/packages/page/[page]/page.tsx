import AnimatedSection from "@/components/AnimatedSection";
import PageLayout from "@/components/layouts/PageLayout";
import Pagination from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { PaginatedResponse } from "@/types";
import { Listing } from "@/types/listing.types";
import { getListingsServer } from "@/services/listing.server";

interface Props {
    params: Promise<{ page: string }>;
}


export default async function PackagesPage({ params }: Props) {
    const { page } = await params;
    const currentPage = parseInt(page || "1", 10);
    const pageSize = 6;

    const res: PaginatedResponse<Listing> =
        await getListingsServer({
            pageIndex: currentPage,
            pageSize,
        });

    const pkgs = res.data;
    const totalPages = Math.ceil(res.count / pageSize);

    return (
        <PageLayout title="Packages">
            <AnimatedSection>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {pkgs.map((pkg, i) => (
                        <Card key={i} className="overflow-hidden border-0 transition-transform duration-300 hover:scale-105 group">
                            <Link href={`/packages/${pkg.slug}`}>
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={pkg.pictureUrl || "/placeholder.jpg"}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <CardContent className="pt-4">
                                    <h3 className="mb-2 font-cal text-lg leading-6 text-black group-hover:text-gray-700">
                                        {pkg.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-900">
                                        {pkg.description || ""}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-900">
                                                {pkg.currency} {pkg.price}
                                            </p>
                                        </div>

                                        <span className="text-sm text-gray-600">
                                            {pkg.listingType}
                                        </span>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination
                            pageName="packages"
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                )}
            </AnimatedSection>
        </PageLayout>
    );
}
