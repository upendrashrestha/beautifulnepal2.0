"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { NotificationStreamService } from "@/services/notificationStream.service";
import {
    NotificationEvent,
    NotificationPreferences,
    NotificationType,
} from "@/types/notification.types";
import notificationPreferencesService from "@/services/notificationpreference.service";
import { notificationService } from "@/services/notification.service";

interface NotificationContextType {
    notifications: NotificationEvent[];
    unreadCount: number;
    clearNotifications: () => Promise<void>;
    preferences: NotificationPreferences;
    updatePreferences: (prefs: NotificationPreferences) => Promise<void>;
}

const defaultPrefs: NotificationPreferences = {
    [NotificationType.LeadAssigned]: false,
    [NotificationType.MessageReceived]: false,
    [NotificationType.LeadCreated]: false,
    [NotificationType.EventReceived]: false,
    [NotificationType.EmailNotificationOn]: false,
};

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    clearNotifications: async () => { },
    preferences: defaultPrefs,
    updatePreferences: async () => { },
});

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [preferences, setPreferences] =
        useState<NotificationPreferences>(defaultPrefs);

    const prefsRef = useRef<NotificationPreferences>(defaultPrefs);
    const streamRef =
        useRef<NotificationStreamService<NotificationEvent> | null>(null);

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ??
        "https://beautifulnepalapi.fly.dev/api";

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                // 1️⃣ Load preferences
                const prefs =
                    await notificationPreferencesService.getNotificationPreferences();
                if (!mounted) return;

                setPreferences(prefs);
                prefsRef.current = prefs;

                // 2️⃣ Load unread notifications
                const unread = await notificationService.getUnreadNotifications?.();
                if (unread && mounted) {
                    setNotifications(unread);
                    setUnreadCount(unread.length);
                }

                // 3️⃣ Start SSE stream once
                if (!streamRef.current) {
                    streamRef.current = new NotificationStreamService<NotificationEvent>(
                        API_BASE_URL,
                        (notification) => {
                            // ✅ ALWAYS use ref (never state)
                            if (!prefsRef.current[notification.type]) return;

                            setNotifications((prev) => [notification, ...prev]);
                            setUnreadCount((prev) => prev + 1);
                        }
                    );

                    await streamRef.current.start();
                }
            } catch (err) {
                console.error("Failed to initialize notifications", err);
            }
        };

        init();

        return () => {
            mounted = false;
            streamRef.current?.stop();
            streamRef.current = null;
        };
    }, [API_BASE_URL]);

    /** Clear notifications */
    const clearNotifications = async () => {
        try {
            await notificationService.deleteNotifications?.();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to clear notifications", err);
        }
    };

    /** Update preferences */
    const updatePreferences = async (prefs: NotificationPreferences) => {
        setPreferences(prefs);
        prefsRef.current = prefs;

        await notificationPreferencesService.addOrUpdateNotificationPreference(
            prefs
        );
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                clearNotifications,
                preferences,
                updatePreferences,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
