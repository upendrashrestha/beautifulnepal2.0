'use client';

import Toast from '@/components/ui/Toast';
import NotificationPreferencesForm from '@/components/users/NotificationPreferenceForm';
import notificationPreferencesService from '@/services/notificationpreference.service';
import { NotificationPreference } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function NotificationPreferencePage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference | null>(null);
    const handleSubmit = async (data: NotificationPreference) => {
        await notificationPreferencesService.addOrUpdateNotificationPreference(data);
        setShowToast(true);
    };

    useEffect(() => {
        notificationPreferencesService.getNotificationPreferences().then(setNotificationPreferences);
    }, []);
    if (!notificationPreferences) return <p className="p-6">Loading…</p>;

    return (
        <main className="mx-auto px-5">
            <div className="flex items-center justify-between pt-4">
                <h1 className="mb-4 text-xl font-bold">User Notification Preference Settings</h1>
                <button
                    type="submit"
                    onClick={() => { router.push('../../') }}
                    className="inline-flex items-center font-medium text-black hover:text-red-600 transition-colors dark:text-white dark:hover:text-red-500 cursor-pointer p-2"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>
            <NotificationPreferencesForm initialData={notificationPreferences} onSubmit={handleSubmit} />
            {showToast && (
                <Toast
                    message="Notification Settings Updated Successfully"
                    onClose={() => setShowToast(false)}
                />
            )}
        </main>
    );
}
