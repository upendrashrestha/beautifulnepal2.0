"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/Image";
import { urlFor } from "@/sanity/lib/image";
import { Destination } from "@/types";
import { fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

export default function FeaturedDestination() {
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        async function loadDestinations() {
            const data = await fetchFeaturedDestinations();
            setDestinations(data || []);
        }
        loadDestinations();
    }, []);

    if (!destinations.length) return null;

    return (
        <section className="my-16">
            <motion.div
                variants={{
                    hidden: {
                        opacity: 0,
                        x: -20,
                    },

                    visible: {
                        opacity: 1,
                        x: 0,
                    },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="animate_left relative mx-auto hidden md:block md:w-full h-auto"
            >
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {destinations.map((d: Destination) => (
                        <Card
                            key={d._id}
                            className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white"
                        >
                            <Link
                                href={`/destinations/${d.slug.current}`}
                                className="flex flex-col sm:flex-row h-full"
                            >
                                {d.heroImage?.asset?._ref && (
                                    <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                                        <Image
                                            src={urlFor(d.heroImage.asset._ref).url()}
                                            alt={d.heroImage?.asset.alt || d.name}
                                            fill
                                            className="object-cover sm:rounded-l-lg sm:rounded-tr-none rounded-t-lg"
                                        />
                                    </div>
                                )}

                                <CardContent className="flex flex-col justify-between p-4 w-full">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors mb-1">
                                            {d.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {d.intro || ""}
                                        </p>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
