'use client'

import eventService from "@/services/event.service";
import { PaginatedResponse } from "@/types";
import { EventSearchParams, EventSpecParams } from "@/types/event.types";
import { useEffect, useState } from "react";
import { Event } from "@/types/event.types";
import EventSearch from "@/components/events/EventSearch";
import { NEPAL_CITIES } from "@/utils/constant";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<EventSpecParams>({
    pageIndex: 1,
    pageSize: 20
  });

  const handleSearch = (searchParams: EventSearchParams) => {
    // Convert time filter to appropriate API params
    const apiParams: EventSpecParams = {
      ...currentParams,
      city: searchParams.city,
      pageIndex: 1 // Reset to first page on new search
    };

    // You can add custom logic for timeFilter if your API supports it
    // For example, you might calculate date ranges or use a sort parameter
    if (searchParams.timeFilter === 'today') {
      // apiParams.startDate = new Date().toISOString();
      // apiParams.endDate = new Date().toISOString();
    } else if (searchParams.timeFilter === 'weekend') {
      // Calculate weekend dates
    } else if (searchParams.timeFilter === 'popular') {
      apiParams.sort = 'popularity-desc'; // or however your API handles this
    }

    setCurrentParams(apiParams);
  };

  useEffect(() => {
    setLoading(true);

        eventService
            .getEvents(currentParams)
            .then((res: PaginatedResponse<Event>) => {
                setEvents(res.data);
               // setTotalCount(res.count);
            })
            .finally(() => setLoading(false));
  }, [currentParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Find Events
        </h1>

        <EventSearch cities={NEPAL_CITIES} onSearch={handleSearch} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {event.description}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-2">
                    {new Date(event.eventOn).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}