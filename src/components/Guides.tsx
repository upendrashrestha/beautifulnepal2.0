"use client";

import Link from "next/link";
import Image from "@/components/Image";
import { urlFor } from "@/sanity/lib/image";
import { Guide } from "@/types";
import { Card, CardContent } from "./ui/card";
import AnimatedSection from "./AnimatedSection";
import { useEffect, useState } from "react";

interface GuideProps {
  guides?: Guide[]; // optional pre-fetched guides
  featured?: boolean;
  destinationSlug?: string;
  title?: string;
}

export default function Guides({ guides: initialGuides = [], featured, destinationSlug, title }: GuideProps) {
  const [guides, setGuides] = useState<Guide[]>(initialGuides);

  // Only fetch if no guides were passed as props
  useEffect(() => {
    async function loadGuides() {
      if (guides.length > 0) return; // already have guides

      let data: Guide[] = [];
      if (featured) {
        const featuredData = await import("@/sanity/lib/fetch").then(mod => mod.fetchFeaturedGuides());
        data = [...data, ...(featuredData || [])];
      }
      if (destinationSlug) {
        const destinationData = await import("@/sanity/lib/fetch").then(mod => mod.fetchGuidesByDestination(destinationSlug));
        data = [...data, ...(destinationData || [])];
      }
      setGuides(data);
    }

    loadGuides();
  }, [featured, destinationSlug, guides.length]);

  if (!guides.length) return null;

  return (
    <section className="mb-10">
      <AnimatedSection>
        {title && (
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          </div>
        )}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const guideImageUrl = guide.mainImage?.asset?._ref
              ? urlFor(guide.mainImage.asset._ref).width(600).height(400).url()
              : "/placeholder.jpg";

            return (
              <Card
                key={guide._id}
                className="group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl"
              >
                <Link href={`/guides/${guide.slug.current}`}>
                  <div className="relative h-52 w-full">
                    <Image
                      src={guideImageUrl}
                      alt={guide.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-2xl"
                      priority
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                    {guide.excerpt && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{guide.excerpt}</p>
                    )}
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
