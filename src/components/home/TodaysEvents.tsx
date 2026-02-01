'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import eventService from '@/services/event.service';
import { Event } from '@/types/event.types';
import { PaginatedResponse } from '@/types';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Skeleton from '@/components/skeleton/Skeleton';

export default function TodaysEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    eventService
      .getEvents({
        pageIndex: 1,
        pageSize: 3,
        timeFilter: "today"
      })
      .then((res: PaginatedResponse<Event>) => {
        setEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

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
        ) : events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                    <FaCalendarAlt className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    {event.eventOn}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>
                    <span className="text-sm font-medium">{event.city}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FaClock className="text-sm" />
                    </div>
                    <span className="text-sm font-medium">{formatTime(event.eventOn)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 text-gray-900 dark:text-white font-medium text-sm group-hover:gap-3 transition-all">
                  <span>View Details</span>
                  <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <FaCalendarAlt className="text-4xl text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No events scheduled for today</p>
          </div>
        )}
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