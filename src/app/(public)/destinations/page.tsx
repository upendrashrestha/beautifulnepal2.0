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
  return {
    title: "Top Destinations in Nepal | BeautifulNepal Travel Guide",
    description:
      "Explore the most beautiful destinations in Nepal — from Himalayan trekking routes and cultural heritage sites to hidden gems and scenic towns. Plan your journey with BeautifulNepal.",
    keywords: [
      "Nepal destinations",
      "places to visit in Nepal",
      "Beautiful Nepal",
      "Nepal travel guide",
      "tourist attractions in Nepal",
      "Nepal tourism",
      "Nepal travel destinations",
    ],
    openGraph: {
      title: "Top Destinations in Nepal | BeautifulNepal",
      description:
        "Discover Nepal’s most stunning destinations, including mountains, temples, lakes, and cultural landmarks. Start planning your Nepal adventure today.",
      url: "https://beautifulnepal.com/destinations",
      siteName: "BeautifulNepal",
      images: [
        {
          url: "https://beautifulnepal.com/og/destinations.jpg",
          width: 1200,
          height: 630,
          alt: "Beautiful travel destinations in Nepal",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Top Destinations in Nepal | BeautifulNepal",
      description:
        "From the Himalayas to heritage cities, explore the best destinations in Nepal with BeautifulNepal.",
      images: ["https://beautifulnepal.com/og/destinations.jpg"],
    },
    alternates: {
      canonical: "https://beautifulnepal.com/destinations",
    },
  };
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
