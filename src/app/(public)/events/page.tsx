'use client'

import eventService from "@/services/event.service";
import { PaginatedResponse } from "@/types";
import { EventSpecParams } from "@/types/event.types";
import { useEffect, useState } from "react";
import { Event } from "@/types/event.types";
import EventSearch from "@/components/events/EventSearch";
import { NEPAL_CITIES } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import Skeleton from "@/components/skeleton/Skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<EventSpecParams>({
    pageIndex: 1,
    pageSize: 20
  });
  const router = useRouter();

  const handleSearch = (searchParams: EventSpecParams) => {
    const apiParams: EventSpecParams = {
      ...currentParams,
      city: searchParams.city,
      search: searchParams.search,
      pageIndex: 1
    };

    if (searchParams.timeFilter === 'popular') {
      apiParams.sort = 'popularity-desc';
    }

    setCurrentParams(apiParams);
  };

  useEffect(() => {
    setLoading(true);

    eventService
      .getEvents(currentParams)
      .then((res: PaginatedResponse<Event>) => {
        setEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, [currentParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-8">
          Events
        </h1>

        <EventSearch cities={NEPAL_CITIES} onSearch={handleSearch} />

<motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="my-10 flex justify-center"
            >
                <Link
                    href="./events/submit-your-event"
                    className="inline-block px-6 py-3 rounded-full font-semibold bg-black text-gray-400 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                    + Add Your Event For Free
                </Link>
            </motion.section>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
                >
                  <Skeleton className="w-full h-56" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </>
          ) : events.length > 0 ? (
            events.map((event) => {
              const dateInfo = formatDate(event.eventOn);
              return (
                <div
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    {event.pictureUrl ? (
                      <img
                        src={event.pictureUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-500 text-6xl opacity-50" />
                      </div>
                    )}
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 text-center">
                      <div className="text-2xl font-bold text-black dark:text-indigo-400 leading-none">
                        {dateInfo.day}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        {dateInfo.month}
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <FaMapMarkerAlt className="text-black shrink-0" />
                        <span className="truncate">{event.city}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <FaClock className="text-black shrink-0" />
                        <span>{dateInfo.time}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Action hint */}
                    <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <FaCalendarAlt className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}