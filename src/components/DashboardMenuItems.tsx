"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FaSignOutAlt,
    FaTachometerAlt,
    FaUsers,
    FaEnvelope,
    FaBusinessTime,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import NineDotsIcon from "./ui/NineDotsIcon";

export default function DashboardMenuItems() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div
            className={"w-full flex items-center justify-end gap-4 "}
        >
            <div className="relative" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={open}
                    className="flex items-center gap-1 text-sm text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors hover:text-black dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                >
                    <NineDotsIcon />
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        className="
            absolute right-0 mt-3 z-50 w-142
            rounded-2xl bg-white
            shadow-2xl border border-gray-100
            p-3
          "
                        role="menu"
                    >
                        <div className="grid grid-cols-3 gap-3">
                            <MenuItem
                                href="/dashboard"
                                icon={<FaTachometerAlt />}
                                label="Dashboard"
                                onClick={() => setOpen(false)}
                            />

                            <MenuItem
                                href="/dashboard/leads"
                                icon={<FaUsers />}
                                label="Leads"
                                onClick={() => setOpen(false)}
                            />

                            <MenuItem
                                href="/dashboard/clients"
                                icon={<FaBusinessTime />}
                                label="Clients"
                                onClick={() => setOpen(false)}
                            />

                            <MenuItem
                                href="/dashboard/messages"
                                icon={<FaEnvelope />}
                                label="Messages"
                                onClick={() => setOpen(false)}
                            />


                        </div>
                    </div>
                )}



            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red px-4 py-2 rounded-md hover:bg-red-100 transition-colors hover:text-red-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
            >
                <FaSignOutAlt />
            </button>
        </div>
    );
}

/* ------------------ */
/* Menu item card */
/* ------------------ */
function MenuItem({
    href,
    icon,
    label,
    onClick,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="
        flex flex-col items-center justify-center gap-2
        rounded-xl border border-gray-100
        bg-gray-50
        py-4 transition
        hover:bg-gray-100
      "
        >
            <span className="text-gray-700">{icon}</span>
            <span className="text-sm font-medium text-gray-800">{label}</span>
        </Link>
    );
}
