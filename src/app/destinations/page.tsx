import { fetchDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    return { title: "Destinations", description: "Destinations list page." };
}

export default async function DestinationListPage() {
    const destinations = await fetchDestinations();
    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">Destinations</h1>
            <ul>
                {destinations.map((d: Destination) => (
                    <Link
                        key={d._id}
                        href={`/destinations/${d.slug.current}`}
                        className="group rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-800 transition-colors">
                                {d.name}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3">{d.intro || ""}</p>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
}