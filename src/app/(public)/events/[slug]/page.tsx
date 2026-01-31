// app/events/[slug]/page.tsx
import { Metadata } from "next";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import eventService from "@/services/event.service";
import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import SocialShare from "@/components/SocialShare";
import EventImageModal from "@/components/events/EventImageModal";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ---- SERVER COMPONENT ----
export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let event;
  try {
    event = await eventService.getEventBySlug(slug);
  } catch (error) {
    console.error("Error fetching event:", error);
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return { full: "TBA", time: "TBA" };
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaCalendarAlt className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/events"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(event.eventOn);

  return (
    <PageLayout title={event.title}>
      <AnimatedSection>
        <div className="mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/events"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </Link>

          {/* Hero Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
            {event.pictureUrl ? (
              <EventImageModal
                imageUrl={event.pictureUrl}
                alt={event.title || "Event Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-500 to-purple-600 flex items-center justify-center">
                <FaCalendarAlt className="text-white text-8xl opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div
              className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
              aria-label="Share event"
            >
              <SocialShare />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{event.title}</h1>

            {/* Event Meta Info */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {[
                { icon: FaCalendarAlt, label: "Date", value: dateInfo.full },
                { icon: FaClock, label: "Time", value: dateInfo.time },
                { icon: FaMapMarkerAlt, label: "Location", value: event.city || "TBA" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg">
                    <item.icon className="text-gray-600 dark:text-gray-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {event.description || "Details coming soon."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-wrap gap-4">
              <SocialShare />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageLayout>
  );
}

// ---- DYNAMIC METADATA ----
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let event;
  try {
    event = await eventService.getEventBySlug(slug);
  } catch {
    return { title: "Event Not Found", description: "" };
  }

  return {
    title: event.title,
    description: event.description?.slice(0, 160) || "",
    keywords: event.type,
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160) || "",
      images: event.pictureUrl ? [{ url: event.pictureUrl }] : undefined,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${slug}`,
    },
  };
}
