import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import SectionContainer from "@/components/SectionContainer";
import SocialShare from "@/components/SocialShare";
import Image from '@/components/Image';
import Link from "@/components/Link";
import PageLayout from "@/components/layouts/PageLayout";
import { Listing as Package } from "../../../../../types/listing.types";
import { getListingBySlugServer } from "@/services/listing.server";
import { FaCalendar, FaClock, FaMapPin } from "react-icons/fa";


export const dynamic = "force-dynamic";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { slug } = await props.params;
    const pkg = await getListingBySlugServer(slug);

    if (!pkg) return { title: "Package not found", description: "" };

    return generateMetadataHelper({
        title: pkg.title,
        description: pkg.description || "",
        keywords: pkg.keywords,
        openGraphImageUrl: pkg.pictureUrl,
        author: pkg.createdBy,
    });
}

export default async function PackagePage(props: PageProps) {
    const { slug } = await props.params;
    const pkg = await getListingBySlugServer(slug);

    if (!pkg) return notFound();

    return <PackageView {...pkg} />;
}

function PackageView(pkg: Package) {
    const formattedDate = pkg.createdOn
        ? new Date(pkg.createdOn).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown date";

    const formatPrice = (price: number, currency: string = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(price);
    };

    const getDuration = () => {
        if (!pkg.itinerary?.items?.length) return null;
        return pkg.itinerary.items.length;
    };

    return (
        <PageLayout title={pkg.title}>
            <SectionContainer>
                <article>
                    {/* Hero Image */}
                    {pkg.pictureUrl && (
                        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
                            <Image
                                src={pkg.pictureUrl}
                                alt={pkg.title}
                                fill
                                priority
                                loading="eager"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Badge */}
                            {pkg.listingType && (
                                <div className="absolute top-6 left-6">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-gray-900">
                                        {pkg.listingType}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Package Info */}
                            <div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {pkg.location && (
                                        <div className="flex items-center gap-1">
                                            <FaMapPin className="h-4 w-4" />
                                            <span>{pkg.location}</span>
                                        </div>
                                    )}
                                    {getDuration() && (
                                        <div className="flex items-center gap-1">
                                            <FaCalendar className="h-4 w-4" />
                                            <span>{getDuration()} Days</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <FaClock className="h-4 w-4" />
                                        <time dateTime={pkg.createdOn ?? ""}>{formattedDate}</time>
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {pkg.title}
                                </h1>

                                {pkg.description && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-lg text-gray-700 dark:text-gray-300">
                                            {pkg.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Itinerary Section */}
                            {pkg.itinerary && pkg.itinerary.items && pkg.itinerary.items.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <FaCalendar className="h-6 w-6 text-primary-600" />
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Day by Day Itinerary
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        {pkg.itinerary.items
                                            .sort((a, b) => (Number(a.day) || 0) - (Number(b.day) || 0))
                                            .map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
                                                >
                                                    {/* Day Number Badge */}
                                                    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                                                        {item.day || index + 1}
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                            {item.title}
                                                        </h3>

                                                        {item.description && (
                                                            <p className="text-gray-700 dark:text-gray-300">
                                                                {item.description}
                                                            </p>
                                                        )}




                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}


                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-6">
                                {/* Price Card */}
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-6">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Starting from
                                        </div>
                                        <div className="text-4xl font-bold text-primary-600">
                                            {formatPrice(pkg.price, pkg.currency)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            per person
                                        </div>
                                    </div>

                                    {pkg.externalUrl ? (
                                        <a
                                            href={pkg.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                                        >
                                            Book Now
                                        </a>
                                    ) : (
                                        <button
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Inquire Now
                                        </button>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">

                                        {getDuration() && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {getDuration()} Days
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                {pkg.itinerary && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Quick Info
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            {pkg.itinerary.difficultyLevel && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {pkg.itinerary.difficultyLevel}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Social Share */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Share this trip
                                    </h3>
                                    <SocialShare />
                                </div>

                                {/* Back Link */}
                                <Link
                                    href="/packages"
                                    className="block text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                                >
                                    ← Back to all packages
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </SectionContainer>
        </PageLayout>
    );
}