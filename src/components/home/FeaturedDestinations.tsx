// components/FeaturedDestinations.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Destination } from "@/types";
import { Card, CardContent } from "../ui/card";
import AnimatedSection from "../AnimatedSection";
import { FaArrowRight } from "react-icons/fa";

interface FeaturedDestinationProps {
  destinations: Destination[];
  title?: string;
  limit?: number;
}

export default function FeaturedDestination({
  destinations,
  title,
  limit,
}: FeaturedDestinationProps) {
  if (!destinations || destinations.length === 0) return null;

  const displayedDestinations = limit ? destinations.slice(0, limit) : destinations;

  return (
    <section className="mb-10 mt-10">
      <AnimatedSection>
        {title && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {displayedDestinations.map((destination, index) => {
            const heroImageUrl = destination.heroImage?.asset?._ref
              ? urlFor(destination.heroImage.asset._ref).width(600).height(400).url()
              : "/placeholder.jpg";

            const heroImageAlt = destination.heroImage?.asset?.alt || destination.name;

            return (
              <Card
                key={destination._id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 group hover:-translate-y-2"
              >
                <Link
                  href={`/destinations/${destination.slug.current}`}
                  className="flex flex-col h-full"
                >
                  {heroImageUrl && (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={heroImageUrl}
                        alt={heroImageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  <CardContent className="flex flex-col justify-between p-6 flex-grow">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                        {destination.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {destination.intro || ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-gray-900 dark:text-white font-medium text-sm group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* View All Destinations Link */}
        <div className="flex justify-center mt-12">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>View All Destinations</span>
            <FaArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}