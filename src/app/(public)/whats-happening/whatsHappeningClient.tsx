"use client";

import { CommunityEvent } from "../../../../types";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface WhatsHappeningClientProps {
  events: CommunityEvent[];
}

export default function WhatsHappeningClient({ events }: WhatsHappeningClientProps) {
  if (!events || events.length === 0)
    return <p className="text-center py-10 text-gray-500">No upcoming events.</p>;

  return (
    <section className="my-10">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-8">What&apos;s Happening in Nepal</h1>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => {
            const imageUrl = event.image?.asset?._ref
              ? urlFor(event.image.asset._ref).width(600).height(400).url()
              : "/placeholder.jpg";

            const imageAlt = event.image?.asset?.alt || event.title;

            return (
              <Card
                key={event._id}
                className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="rounded-t-2xl object-cover"
                    priority={index < 3} // LCP: first 3 images
                  />
                </div>
                <CardContent className="p-5 flex flex-col justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h2>
                  {event.location && (
                    <p className="text-gray-600 text-sm mt-1">{event.location}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-2">
                    {event.eventDate} {event.eventTime}
                    {event.eventEndDate
                      ? ` - ${event.eventEndDate} ${event.eventEndTime ?? ""}`
                      : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
