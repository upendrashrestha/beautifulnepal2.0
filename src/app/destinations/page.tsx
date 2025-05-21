import { fetchDestinations } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Destination } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/layouts/PageLayout";

export async function generateMetadata(): Promise<Metadata> {
    return { title: "Destinations", description: "Destinations list page." };
}

export default async function DestinationListPage() {
    const destinations = await fetchDestinations();
    return (
        <PageLayout title="Destinations">
            <ul className="space-y-6">
                {destinations.map((d: Destination) => (
                    <li key={d._id}>
                        <Link
                            href={`/destinations/${d.slug.current}`}
                            className="flex flex-col sm:flex-row items-start gap-4 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                            {d.heroImage?.asset?._ref && (
                                <div className="flex-shrink-0 w-full sm:w-48 h-40 relative">
                                    <Image
                                        src={urlFor(d.heroImage.asset._ref).url()}
                                        alt={d.heroImage?.asset.alt || d.name}
                                        fill
                                        className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                                    />
                                </div>
                            )}

                            <div className="p-4 flex-1">
                                <h2 className="text-xl font-extrabold text-gray-800 mb-1 group-hover:text-blue-700 transition">
                                    {d.name}
                                </h2>
                                <p className="text-gray-600 text-sm line-clamp-3">{d.intro || ""}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </PageLayout>
    );
}