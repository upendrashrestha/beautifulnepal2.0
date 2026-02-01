'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaEnvelope,
  FaBusinessTime,
  FaMemory,
  FaAddressCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsPanel from "./NotificationPanel";

export default function DashboardMenuItems() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only apply on desktop
      if (window.innerWidth < 768) return;

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


  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="text-lg font-bold">
          Dashboard
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <NotificationsPanel />

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(prev => !prev)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>


          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-black hover:text-red-500"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-[101] md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer - positioned above overlay */}
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-xl p-5 md:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Menu</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <MenuItem href="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/leads" icon={<FaAddressCard />} label="Leads" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/clients" icon={<FaBusinessTime />} label="Clients" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/messages" icon={<FaEnvelope />} label="Messages" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/cache" icon={<FaMemory />} label="Cache" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/users" icon={<FaUsers />} label="Users" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/events" icon={<FaCalendarAlt />} label="Events" onClick={() => setOpen(false)} />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
              type="button"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}

/* ---------------- MENU ITEM ---------------- */
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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('MenuItem clicked:', label); // Debug log
    onClick();
    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        flex flex-col items-center justify-center gap-2
        rounded-xl border border-gray-200
        bg-gray-50 py-4 w-full
        active:bg-gray-200
        transition-colors
        text-center
      "
    >
      <span className="text-lg text-gray-700">{icon}</span>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  );
}