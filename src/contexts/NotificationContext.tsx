"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { NotificationStreamService } from "@/services/notificationStream.service";
import { NotificationEvent } from "@/types";
import { notificationService } from "@/services/notification.service";

interface NotificationContextType {
    notifications: NotificationEvent[];
    unreadCount: number;
    clearNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    clearNotifications: async () => { },
});

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const streamRef = useRef<NotificationStreamService<NotificationEvent> | null>(
        null,
    );

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "https://beautifulnepalapi.fly.dev/api";

    useEffect(() => {
        const loadUnread = async () => {
            try {
                const unread = await notificationService.getUnreadNotifications();
                setNotifications(unread);
                setUnreadCount(unread.length);
            } catch (err) {
                console.error("Failed to load unread notifications", err);
            }
        };

        loadUnread();
        if (streamRef.current) return;
        streamRef.current = new NotificationStreamService<NotificationEvent>(
            API_BASE_URL,
            (notification) => {
                //console.log("[SSE RECEIVED]", notification);
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            },
        );

        streamRef.current.start();

        return () => {
            streamRef.current?.stop();
        };
    }, [API_BASE_URL]);

    const clearNotifications = async () => {
        try {
            await notificationService.deleteNotifications();

            // 🔥 instant UI update
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to clear notifications", err);
        }
    };
    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
