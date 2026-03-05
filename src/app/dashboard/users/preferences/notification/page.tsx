'use client';

import Toast from '@/components/ui/Toast';
import NotificationPreferencesForm from '@/components/users/NotificationPreferenceForm';
import notificationPreferencesService from '@/services/notificationpreference.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { NotificationPreferences } from "../../../../../../types/notification.types";

export default function NotificationPreferencePage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);

    // Handle form submission
    const handleSubmit = async (data: NotificationPreferences) => {
        try {
            await notificationPreferencesService.addOrUpdateNotificationPreference(data);
            setShowToast(true);
        } catch (err) {
            console.error("Failed to update preferences", err);
        }
    };

    // Load preferences on mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const prefs = await notificationPreferencesService.getNotificationPreferences();
                setNotificationPreferences(prefs);
            } catch (err) {
                console.error("Failed to load preferences", err);
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, []);

    if (loading || !notificationPreferences) return <p className="p-6">Loading…</p>;

    return (
        <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="mb-4 text-xl font-bold">User Notification Preference Settings</h1>
                <button
                    type="button"
                    onClick={() => router.push('../../')}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <NotificationPreferencesForm
                initialData={notificationPreferences}
                onSubmit={handleSubmit}
            />

            {showToast && (
                <Toast
                    message="Notification Settings Updated Successfully"
                    onClose={() => setShowToast(false)}
                />
            )}
        </main>
    );
}
