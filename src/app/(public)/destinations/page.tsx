// app/destinations/page.tsx
import { fetchDestinations } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Destination } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/layouts/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Destinations", description: "Destinations list page." };
}

export default async function DestinationListPage() {
  const destinations = await fetchDestinations();

  return (
    <PageLayout title="Destinations">
      <AnimatedSection>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination: Destination) => {
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
                        priority
                      />
                    </div>
                  )}

                  <CardContent className="flex flex-col justify-between p-4 w-full">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors mb-1">
                        {destination.name}
                      </h2>
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
    </PageLayout>
  );
}
