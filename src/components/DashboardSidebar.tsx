"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    FaUsers,
    FaEnvelope,
    FaBusinessTime,
    FaAddressCard,
    FaCalendarAlt,
    FaSlidersH,
    FaAngleLeft,
    FaAngleRight,
    FaCameraRetro,
    FaTools,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";

const menuItems = [
    { href: "/dashboard/leads", label: "Leads", icon: FaAddressCard },
    { href: "/dashboard/listings", label: "Listings", icon: FaCameraRetro },
    { href: "/dashboard/clients", label: "Clients", icon: FaBusinessTime },
    { href: "/dashboard/messages", label: "Messages", icon: FaEnvelope },
    { href: "/dashboard/users", label: "Users", icon: FaUsers },
    { href: "/dashboard/events", label: "Events", icon: FaCalendarAlt },
    {
        label: "Settings",
        icon: FaSlidersH,
        subMenu: [
            { href: "/dashboard/users/change-password", label: "Change Password" },
            { href: "/dashboard/users/update", label: "Update Profile" },
            { href: "/dashboard/users/preferences/notification", label: "Notification Preferences" },
        ],
    },
    {
        label: "Tools",
        icon: FaTools,
        subMenu: [
            { href: "/dashboard/send-email", label: "Send Email" },
            { href: "/dashboard/cache", label: "Cache" },
        ],
    },
];

export default function DashboardSidebar({ onToggle }: { onToggle?: (open: boolean) => void }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleSidebar = () => {
        setOpen((prev) => {
            onToggle?.(!prev);
            return !prev;
        });
    };

    const toggleSubMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    return (
        <aside
            className={`hidden md:flex fixed inset-y-0 left-0 z-40 flex-col border-r bg-white transition-all duration-300 ${open ? "w-64" : "w-20"
                }`}
        >
            <nav className="flex-1 px-2 mt-20 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const hasSubMenu = !!item.subMenu;

                    const isActive =
                        item.href !== "" && item.href &&
                        (pathname === item.href || pathname.startsWith(`${item.href}/`));

                    const isSubMenuOpen =
                        openMenus.includes(item.label) ||
                        item.subMenu?.some((sub) => pathname === sub.href);

                    return (
                        <div key={item.label}>
                            {/* Parent Item */}
                            {hasSubMenu ? (
                                <button
                                    onClick={() => toggleSubMenu(item.label)}
                                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${isSubMenuOpen
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                        } ${!open ? "justify-center" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="text-base" />
                                        {open && <span>{item.label}</span>}
                                    </div>

                                    {open && (
                                        isSubMenuOpen ? (
                                            <FaChevronDown size={12} />
                                        ) : (
                                            <FaChevronRight size={12} />
                                        )
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.href!}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                        } ${!open ? "justify-center" : ""}`}
                                >
                                    <Icon className="text-base" />
                                    {open && <span>{item.label}</span>}
                                </Link>
                            )}

                            {/* Submenu */}
                            {hasSubMenu && open && isSubMenuOpen && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {item.subMenu!.map((sub) => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href}
                                            className={`block px-3 py-1 rounded text-sm font-medium transition ${pathname === sub.href
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse Button */}
            <div className="mt-auto flex p-4 w-full">
                <button
                    onClick={toggleSidebar}
                    className="right-4 -translate-y-1/2 absolute bottom-2"
                    title={open ? "Collapse Sidebar" : "Expand Sidebar"}

                >
                    {open ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />}
                </button>
            </div>
        </aside>
    );
}
