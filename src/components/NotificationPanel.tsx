"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";
import { FaBell, FaTimes, FaTrash } from "react-icons/fa";

export default function NotificationsPanel() {
    const { notifications, unreadCount, clearNotifications } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleDeleteAll = async () => {
        if (!notifications.length) return;
        await clearNotifications();
        setOpen(false);
    };

    return (
        <div className="">
            <div className="relative">
                {/* Trigger */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="relative flex items-center p-2 rounded-full cursor-pointer hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-700 transition"
                >
                    <FaBell
                        size={18}
                        className={` ${unreadCount > 0 ? "text-red-600" : "text-gray-600 hover:text-black"}`}
                    />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 text-xs rounded-full bg-red-600 text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Overlay (mobile only) */}
                {open && (
                    <div
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    />
                )}

                {/* Panel */}
                {open && (
                    <div
                        className="
                            fixed md:absolute
                            inset-x-0 bottom-0 md:inset-auto
                            md:right-0 md:top-full
                            mt-0 md:mt-2
                            w-full md:w-96
                            max-h-[80vh]
                            rounded-t-xl md:rounded-lg
                            bg-white dark:bg-gray-800
                            shadow-xl border border-gray-200 dark:border-gray-700
                            z-50
                            flex flex-col
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 flex-shrink-0">
                            <h3 className="font-semibold">Notifications</h3>
                            <FaTimes
                                onClick={() => setOpen(false)}
                                className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition"
                            />
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-sm text-gray-500 text-center">
                                    No notifications
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {notifications.map((n) => (
                                        <li
                                            key={n.id ?? n.createdOn}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <p className="font-semibold text-sm">{n.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {n.body}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.createdOn).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end px-4 py-3 border-t dark:border-gray-700 flex-shrink-0 ">
                            <button
                                className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-red-700 dark:hover:text-gray-300 transition"
                                onClick={() => {
                                    handleDeleteAll();
                                }}
                            >
                                <FaTrash />
                                Delete All Notifications
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
