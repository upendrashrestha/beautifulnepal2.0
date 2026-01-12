"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return user &&
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm text-red-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                <FaBars />
                Admin
            </button>

            {open && (
                <div
                    className={`
    absolute left-0 right-0 z-50 mt-3 w-full sm:w-64
    rounded-2xl bg-white/90 backdrop-blur-md shadow-xl
    max-h-[70vh] overflow-y-auto transition-all duration-200
  `}
                    role="menu"
                    aria-label="Dashboard dropdown"
                >
                    <ul className="py-2 divide-y divide-gray-50">

                        <li key="dashboard">
                            <Link
                                href={`/dashboard`}
                                onClick={() => setOpen(false)}
                                className="
            block px-5 py-2 text-[15px] font-medium text-gray-800
            hover:text-blue-600
            transition-colors duration-150
          "
                                role="menuitem"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li key="leads">
                            <Link
                                href={`/dashboard/leads`}
                                onClick={() => setOpen(false)}
                                className="
            block px-5 py-2 text-[15px] font-medium text-gray-800
            hover:text-blue-600
            transition-colors duration-150
          "
                                role="menuitem"
                            >
                                Leads
                            </Link>
                        </li>
                        <li key="messages">
                            <Link
                                href={`/dashboard/messages`}
                                onClick={() => setOpen(false)}
                                className="
            block px-5 py-2 text-[15px] font-medium text-gray-800
            hover:text-blue-600
            transition-colors duration-150
          "
                                role="menuitem"
                            >
                                Messages
                            </Link>
                        </li>

                        <li key="logout">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm px-4 py-2 rounded-md text-red-400 cursor-pointer hover:text-red-800 transition-colors w-full text-left"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>

            )}
        </div>
        || <></>

}
