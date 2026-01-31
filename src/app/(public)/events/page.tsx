// app/events/page.tsx
import { Metadata } from "next";
import eventService from "@/services/event.service";
import { Event, EventSpecParams } from "@/types/event.types";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import EventSearchClient from "./EventSearchClient";

interface PageProps {
  searchParams?: Promise<EventSpecParams>;
}

// ---- SERVER COMPONENT ----
export default async function EventsPage({ searchParams }: PageProps) {

  const paramsFromUrl = await searchParams;

  // 🔁 Map URL params → backend spec params
  const params: EventSpecParams = {
    pageIndex: Number(paramsFromUrl?.pageIndex ?? 1),
    pageSize: Number(paramsFromUrl?.pageSize ?? 20),
    search: paramsFromUrl?.search ?? "",
    city: paramsFromUrl?.city ?? "",
    type: paramsFromUrl?.type,
    status: paramsFromUrl?.status,
    timeFilter: paramsFromUrl?.timeFilter ?? "all",
  };

  let events: Event[] = [];
  try {
    const res = await eventService.getEvents(params);
    events = res.data;
  } catch (err) {
    console.error("Error fetching events:", err);
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-8">
          Events
        </h1>

        <EventSearchClient initialParams={params} />

        <div className="w-full py-10 flex items-center justify-center">
          <Link
            href="/events/submit-your-event"
            className="inline-block px-6 py-3 rounded-full font-semibold bg-black text-white hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            + Add Your Event For Free
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
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

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

// ---- DYNAMIC METADATA ----
export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Festivals & Events in Nepal | BeautifulNepal",
  description:
    "Discover upcoming festivals and cultural events in Nepal — from traditional celebrations and religious festivals to local gatherings and travel events.",
  keywords: [
    "Nepal festivals",
    "events in Nepal",
    "Nepal cultural events",
    "Nepal celebrations",
    "BeautifulNepal events",
  ],
  openGraph: {
    title: "Festivals & Events in Nepal | BeautifulNepal",
    description:
      "Stay updated with Nepal’s festivals, cultural events, and local celebrations happening across the country.",
    url: "https://beautifulnepal.com/events",
    siteName: "BeautifulNepal",
    images: [
      {
        url: "https://beautifulnepal.com/og/events.jpg",
        width: 1200,
        height: 630,
        alt: "Festivals and events in Nepal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Festivals & Events in Nepal | BeautifulNepal",
    description: "Explore festivals, cultural celebrations, and events happening in Nepal.",
    images: ["https://beautifulnepal.com/og/events.jpg"],
  },
  alternates: {
    canonical: "https://beautifulnepal.com/events",
  },
});
