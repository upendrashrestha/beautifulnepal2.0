'use client'

import eventService from "@/services/event.service";
import { PaginatedResponse } from "@/types";
import { EventSpecParams } from "@/types/event.types";
import { useEffect, useState } from "react";
import { Event } from "@/types/event.types";
import EventSearch from "@/components/events/EventSearch";
import { NEPAL_CITIES } from "@/utils/constant";
import Skeleton from "@/components/skeleton/Skeleton";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<EventSpecParams>({
    pageIndex: 1,
    pageSize: 20
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-8">
          Events
        </h1>

        <EventSearch cities={NEPAL_CITIES} onSearch={handleSearch} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {event.pictureUrl && (
                  <img
                    src={event.pictureUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {event.city}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 font-medium">
                    {new Date(event.eventOn).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}