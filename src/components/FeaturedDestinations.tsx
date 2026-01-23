// components/FeaturedDestinations.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Destination } from "@/types";
import { Card, CardContent } from "./ui/card";
import AnimatedSection from "./AnimatedSection";

interface FeaturedDestinationProps {
  destinations: Destination[]; // ✅ Receive destinations as prop
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
          <div className="mb-8 flex items-center gap-3">
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
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white group"
              >
                <Link
                  href={`/destinations/${destination.slug.current}`}
                  className="flex flex-col sm:flex-row h-full"
                >
                  {heroImageUrl && (
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                      <Image
                        src={heroImageUrl}
                        alt={heroImageAlt}
                        fill
                        className="object-cover sm:rounded-l-lg sm:rounded-tr-none rounded-t-lg"
                        priority={index < 3} // first 3 images are priority
                      />
                    </div>
                  )}

                  <CardContent className="flex flex-col justify-between p-4 w-full">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {destination.intro || ""}
                      </p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
