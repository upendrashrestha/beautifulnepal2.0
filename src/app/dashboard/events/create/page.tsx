"use client";

import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import eventService from "@/services/event.service";
import EventForm from "@/components/events/EventForm";

export default function CreateEvent() {
    const router = useRouter();

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between pt-4">
                <h1 className="text-xl font-bold mb-4">Create Event</h1>

                <button
                    type="button"
                    onClick={() => router.push("./")}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <EventForm
                submitLabel="Create Event"
                onSubmit={async (data) => {
                    await eventService.createEvent(data);
                    router.push("../events");
                }}
            />
        </div>
    );
}
