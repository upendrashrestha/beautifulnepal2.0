"use client";

import { useState } from "react";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { NotificationPreferences, NotificationType } from "../../../types/notification.types";

interface NotificationPreferencesFormProps {
    initialData?: NotificationPreferences;
    onSubmit: (data: NotificationPreferences) => Promise<void>;
    loading?: boolean;
}

export default function NotificationPreferencesForm({
    initialData,
    onSubmit,
    loading = false,
}: NotificationPreferencesFormProps) {
    const [form, setForm] = useState<NotificationPreferences>({
        LeadAssigned: initialData?.LeadAssigned ?? false,
        MessageReceived: initialData?.MessageReceived ?? false,
        LeadCreated: initialData?.LeadCreated ?? false,
        EventReceived: initialData?.EventReceived ?? false,
        EmailNotificationOn: initialData?.EmailNotificationOn ?? false
    });

    const handleCheckboxChange = (key: NotificationType, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 border rounded shadow bg-white dark:bg-gray-800"
        >
            {Object.values(NotificationType).map((type) => (
                <Checkbox
                    key={type}
                    label={type.replace(/([A-Z])/g, " $1").trim()} // Converts "LeadAssigned" → "Lead Assigned"
                    checked={form[type]}
                    onChange={(v) => handleCheckboxChange(type, v)}
                />
            ))}

            <Button
                type="submit"
                loading={loading}
                label="Save"
                loadingLabel="Saving..."
            />
        </form>
    );
}
