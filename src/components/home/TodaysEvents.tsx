'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import eventService from '@/services/event.service';
import { Event } from '@/types/event.types';
import { PaginatedResponse } from '@/types';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Skeleton from '@/components/skeleton/Skeleton';

export default function TodaysEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    eventService
      .getEvents({
        pageIndex: 1,
        pageSize: 3,
        timeFilter: "today",
        status: "Complete"
      })
      .then((res: PaginatedResponse<Event>) => {
        setEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (timeString: string | undefined) => {
    // If input is just HH:mm, append a dummy date
    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date.getTime())) return timeString; // fallback if invalid
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return { day: "TBA", month: "TBA", time: "TBA" };
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t miss out on what&apos;s happening accross Nepal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) :
          events.length > 0 ? (
            events.map((event) => {
              const dateInfo = formatDate(event.eventOn);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug || event.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {event.pictureUrl ? (
                      <img
                        src={event.pictureUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (<>
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-500 text-6xl opacity-50" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
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
                        <span>{formatTime(event.eventOnTime)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })
          )
            : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <FaCalendarAlt className="text-4xl text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No events scheduled for today</p>
              </div>
            )
        }
      </div>
      {/* View All Events Link */}
      {events.length > 0 && (
        <div className="flex justify-center mt-12">
          <Link
            href="/events"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>View All Events</span>
            <FaArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
}