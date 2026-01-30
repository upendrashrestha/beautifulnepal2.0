'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import eventService from '@/services/event.service';
import { Event } from '@/types/event.types';
import { PaginatedResponse } from '@/types';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
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
        pageSize: 6,
      //  dateFrom: today.toISOString(),
       // dateTo: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
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
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Today’s Events
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : events.length > 0 ? (
          events.map(event => (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {event.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-black" />
                  <span>{event.city}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-black" />
                  <span>{formatTime(event.eventOn)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">No events today</p>
          </div>
        )}
      </div>
    </section>
  );
}
