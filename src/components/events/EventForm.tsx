"use client";

import { useState } from "react";
import { Event, EventCreate } from "@/types/event.types";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Dropdown from "../ui/Dropdown";
import PicturePicker from "../pictures/PicturePicker";
import pictureService from "@/services/picture.service";

interface Props {
    initialData?: Partial<Event>;
    onSubmit: (data: Partial<EventCreate>) => Promise<void>;
    submitLabel: string;
}


const STATUS_OPTIONS = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Review', value: 'Review' },
    { label: 'Complete', value: 'Complete' },
    { label: 'More Info Needed', value: 'MoreInfoNeeded' },
    { label: 'Disqualified', value: 'Disqualified' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Featured', value: 'featured' },
];

export default function EventForm({
    initialData = {},
    onSubmit,
    submitLabel,
}: Props) {
    const [form, setForm] = useState<Partial<Event>>(initialData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | undefined>(initialData.pictureUrl ?? undefined);

    const update = <K extends keyof Event>(key: K, value: Event[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" })); // clear error on change
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.title || !form.title.trim()) {
            newErrors.title = "Title is required.";
        }

        if (!form.eventOn || !form.eventOn.trim()) {
            newErrors.eventOn = "Start Date is required.";
        }

        if (!form.content || !form.content.trim()) {
            newErrors.content = "Event Content is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const updatedForm: Partial<EventCreate> = { ...form };

            if (pictureFile) {
                const res = await pictureService.uploadPicture({
                    name: pictureFile.name,
                    file: pictureFile,

                });

                if (res.url) {
                    updatedForm.pictureUrl = res.url;
                    setPictureUrl(res.url); // keep UI in sync
                }
            }

            await onSubmit(updatedForm);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <Input
                label="Title *"
                value={form.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
                className="input-base"
                error={errors.title}
            />
            <PicturePicker
                label="Select Image"
                value={pictureUrl}
                showGallery={true}
                canDelete={true}
                onChange={({ file, url }) => {
                    setPictureFile(file ?? null);
                    // ✅ HANDLE DELETE
                    if (url === undefined) {
                        // ✅ DELETE CASE (fully type-safe)
                        setPictureUrl(undefined);
                        update("pictureUrl", undefined);
                        return;
                    }

                    setPictureUrl(url);
                    update("pictureUrl", url);
                }}
            />
            <Input
                label="Slug"
                value={form.slug ?? ""}
                onChange={(e) => update("slug", e.target.value)}
                className="input-base"
            />

            <Input
                label="Street"
                value={form.street ?? ""}
                onChange={(e) => update("street", e.target.value)}
                className="input-base"
            />

            <Input
                label="City"
                value={form.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                className="input-base"
            />


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    label="Event Date *"
                    type="date"
                    value={form.eventOn ?? ""}
                    onChange={(e) => update("eventOn", e.target.value)}
                    className="input-base"
                    error={errors.eventOn}
                />

                <Input
                    label="End Date"
                    type="date"
                    value={form.eventOff ?? ""}
                    onChange={(e) => update("eventOff", e.target.value)}
                    className="input-base"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    label="Start Time"
                    type="time"
                    value={form.eventOnTime ?? ""}
                    onChange={(e) => update("eventOnTime", e.target.value)}
                    className="input-base"
                />

                <Input
                    label="End Time"
                    type="time"
                    value={form.eventOffTime ?? ""}
                    onChange={(e) => update("eventOffTime", e.target.value)}
                    className="input-base"
                />
            </div>

            <TextArea
                label="Short Description"
                placeholder="Brief description of the event"
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
            />

            <TextArea
                label="Event Content *"
                placeholder="Full event details"
                value={form.content ?? ""}
                onChange={(e) => update("content", e.target.value)}
                error={errors.content}
            />

            <Input
                label="Type"
                placeholder="Event Type"
                value={form.type ?? ""}
                onChange={(e) => update("type", e.target.value)}
                className="input-base"
            />



            <Input
                label="Organized By"
                value={form.organizedBy ?? ""}
                onChange={(e) => update("organizedBy", e.target.value)}
                className="input-base"
            />

            <Input
                label="Organizer Email"
                value={form.organizerEmail ?? ""}
                onChange={(e) => update("organizerEmail", e.target.value)}
                className="input-base"
            />

            <Dropdown
                label="Status"
                name="status"
                value={form.status}
                options={STATUS_OPTIONS}
                onChange={(e) => update("status", e.target.value)}
            />

            {/* Submit */}
            <div className="flex items-center justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                    {loading ? "Saving…" : submitLabel}
                </button>
            </div>
        </form>
    );
}
