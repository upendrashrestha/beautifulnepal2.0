"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaUsers,
    FaEnvelope,
    FaBusinessTime,
    FaMemory,
    FaAddressCard,
} from "react-icons/fa";

const menuItems = [
    { href: "/dashboard/leads", label: "Leads", icon: FaAddressCard },
    { href: "/dashboard/clients", label: "Clients", icon: FaBusinessTime },
    { href: "/dashboard/messages", label: "Messages", icon: FaEnvelope },
    { href: "/dashboard/cache", label: "Cache", icon: FaMemory },
    { href: "/dashboard/users", label: "Users", icon: FaUsers },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col border-r bg-white">
            <div className="px-6 py-6 text-lg font-bold">Dashboard</div>

            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                transition
                ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }
              `}
                        >
                            <Icon className="text-base" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
