'use client';

import { useState } from "react";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { NotificationPreference } from "@/types";

interface NotificationPreferenceFormProps {
    initialData?: Partial<NotificationPreference>;
    onSubmit: (data: NotificationPreference) => Promise<void>;
    loading?: boolean;
}

export default function NotificationPreferencesForm({
    initialData,
    onSubmit,
    loading = false
}: NotificationPreferenceFormProps) {
    const [form, setForm] = useState<NotificationPreference>({
        leadAssigned: initialData?.leadAssigned ?? false,
        messageReceived: initialData?.messageReceived ?? false
    });

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            [name]: checked
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        await onSubmit(form);


    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white dark:bg-gray-800">

            <Checkbox
                label="Lead Assigned"
                checked={form.leadAssigned}
                onChange={v => handleCheckboxChange("leadAssigned", v)}
            />


            <Checkbox
                label="Message Received"
                checked={form.messageReceived}
                onChange={v => handleCheckboxChange("messageReceived", v)}
            />

            <Button
                type="submit"
                loading={loading}
                label="Save"
                loadingLabel="Saving..."
            />
        </form>
    );
}
