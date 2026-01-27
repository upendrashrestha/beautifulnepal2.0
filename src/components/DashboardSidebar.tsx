'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    FaUsers,
    FaEnvelope,
    FaBusinessTime,
    FaMemory,
    FaAddressCard,
    FaCalendarAlt,
    FaSlidersH,
    FaAngleLeft,
    FaAngleRight,
    FaCameraRetro,
} from "react-icons/fa";

const menuItems = [
    { href: "/dashboard/leads", label: "Leads", icon: FaAddressCard },
    { href: "/dashboard/listings", label: "Listings", icon: FaCameraRetro },
    { href: "/dashboard/clients", label: "Clients", icon: FaBusinessTime },
    { href: "/dashboard/messages", label: "Messages", icon: FaEnvelope },
    { href: "/dashboard/cache", label: "Cache", icon: FaMemory },
    { href: "/dashboard/users", label: "Users", icon: FaUsers },
    { href: "/dashboard/events", label: "Events", icon: FaCalendarAlt },
    {
        href: "",
        label: "Settings",
        icon: FaSlidersH,
        subMenu: [
            { href: "/dashboard/users/change-password", label: "Change Password" },
            { href: "/dashboard/users/update", label: "Update Profile" },
            { href: "/dashboard/users/preferences/notification", label: "Notification Preferences" },
        ],
    },
];

export default function DashboardSidebar({ onToggle }: { onToggle?: (open: boolean) => void }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(true);

    const toggleSidebar = () => {
        setOpen((prev) => {
            onToggle?.(!prev); // optional callback to resize main content
            return !prev;
        });
    };

    return (
        <aside
            className={`
            hidden md:flex
            fixed inset-y-0 left-0 z-40 flex-col border-r bg-white
            transition-all duration-300
            ${open ? "w-64" : "w-20"}
          `}
        >
            {/* Menu */}
            <nav className="flex-1 px-2 mt-20 space-y-1">
                {menuItems.map(({ href, label, icon: Icon, subMenu }) => {
                    const isActive = label === "Settings" ? false : pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <div key={href}>
                            <Link
                                href={href}
                                className={`
                                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                transition
                                ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
                                ${!open ? "justify-center" : ""}
                            `}
                            >
                                <Icon className="text-base" />
                                {open && <span>{label}</span>}
                            </Link>

                            {/* Submenu */}
                            {subMenu && open && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {subMenu.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                block px-3 py-1 rounded text-sm font-medium
                                                ${pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
                                            `}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="mt-auto flex p-4 w-full">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-black hover:text-gray-500 cursor-pointer right"
                    title={open ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {open ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />}
                </button>
            </div>
        </aside>
    );
}
