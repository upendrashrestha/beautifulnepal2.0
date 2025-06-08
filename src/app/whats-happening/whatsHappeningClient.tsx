
'use client';

import AnimatedSection from '@/components/AnimatedSection';
import PageLayout from '@/components/layouts/PageLayout';
import Link from '@/components/Link';
import { Card, CardContent } from '@/components/ui/card';
import { urlFor } from '@/sanity/lib/image';
import { CommunityEvent } from '@/types';
import { FaRegCalendarAlt, FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';

import Image from "next/image";

type WhatsHappeningClientProps = {
    events: CommunityEvent[];
};

export default function WhatsHappeningClient({ events }: WhatsHappeningClientProps) {
    return (
        <PageLayout title="What's Happening in Nepal">
            <AnimatedSection>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 p-4 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 text-center">
                        Hosting an event? Share it with the world!
                    </h2>
                    <Link
                        href="/whats-happening/submit-your-event"
                        className="text-sm px-5 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Submit your event
                    </Link>
                </div>
            </AnimatedSection>

            {events.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No upcoming events right now. Check back soon!</p>
            ) : (
                <section className="my-16">
                    <AnimatedSection>
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((event: CommunityEvent) => (
                                <Link
                                    key={event._id}
                                    href={event.slug ? `/whats-happening/${event.slug.current}` : "#"}
                                    className="group transition-transform hover:scale-[1.02]"
                                >
                                    <Card className="h-full rounded-xl overflow-hidden border border-gray-100 shadow-md bg-white hover:shadow-lg transition-all duration-300">
                                        {event.image &&
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={event.image?.asset._ref ? urlFor(event.image.asset._ref).url() : ""}
                                                    alt={event.image?.asset?.alt || event.title}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        }
                                        <CardContent className="p-6 space-y-4">
                                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary">
                                                {event.title}
                                            </h2>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaRegCalendarAlt className="text-orange-500" />
                                                <span>{event.eventDate}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaRegClock className="text-blue-500" />
                                                <span>{event.eventTime}</span>
                                            </div>

                                            {event.location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FaMapMarkerAlt className="text-red-500" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </AnimatedSection>
                </section>
            )}
        </PageLayout>
    );
}
