'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import eventService from "@/services/event.service";
import { Event } from "@/types/event.types";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft, FaShareAlt } from "react-icons/fa";
import Skeleton from "@/components/skeleton/Skeleton";
import SocialShare from "@/components/SocialShare";
import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    eventService
      .getEventById(eventId)
      .then((data: Event) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const formatDate = (dateString: string) => {
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

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="w-full h-96 rounded-2xl mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaCalendarAlt className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/events')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(event.eventOn);

  return (
      <PageLayout title="">
                <AnimatedSection>
    <div className="mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
          {event.pictureUrl ? (
            <img
              src={event.pictureUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-500 to-purple-600 flex items-center justify-center">
              <FaCalendarAlt className="text-white text-8xl opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
            aria-label="Share event"
          >
            <FaShareAlt className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {event.title}
          </h1>

          {/* Event Meta Info */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg">
                <FaCalendarAlt className="text-gray-600 dark:text-gray-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="text-gray-900 dark:text-white font-semibold">{dateInfo.full}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg">
                <FaClock className="text-gray-600 dark:text-gray-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                <p className="text-gray-900 dark:text-white font-semibold">{dateInfo.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-gray-600 dark:text-gray-400 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                <p className="text-gray-900 dark:text-white font-semibold">{event.city}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

         

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-wrap gap-4">
            <SocialShare/>
          </div>
        </div>
      </div>
      </AnimatedSection>
      </PageLayout>
  );
}