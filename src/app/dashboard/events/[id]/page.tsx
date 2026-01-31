'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import eventService from '@/services/event.service';
import EventForm from '@/components/events/EventForm';
import { Event } from '@/types/event.types';
import { FaTimes } from 'react-icons/fa';

export default function UpdateEventPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);

    const eventId = params?.id;

    useEffect(() => {
        if (!eventId) return;
        eventService.getEventById(eventId).then(setEvent);
    }, [eventId]);

    if (!event) return <p className="p-6">Loading…</p>;

    return (
        <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">Update Event</h1>
                <button
                    type="button"
                    onClick={() => router.push('../events')}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <EventForm
                initialData={event}
                submitLabel="Update"
                onSubmit={async (data: Partial<Event>) => {
                    await eventService.updateEvent(data);
                    router.push('../events');
                }}
            />
        </main>
    );
}
