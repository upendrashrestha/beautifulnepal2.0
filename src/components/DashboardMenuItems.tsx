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
    <header className="fixed top-0 left-0 z-50 w-full bg-white border-b shadow-sm">
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
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <FaBars />
          </button>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-black hover:text-red-500"
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
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl p-5 md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Menu</h3>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <MenuGrid onNavigate={() => setOpen(false)} />

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg text-red-600 hover:bg-red-50"
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

/* ---------------- MENU GRID ---------------- */
function MenuGrid({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MenuItem href="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClick={onNavigate} />
      <MenuItem href="/dashboard/leads" icon={<FaAddressCard />} label="Leads" onClick={onNavigate} />
      <MenuItem href="/dashboard/clients" icon={<FaBusinessTime />} label="Clients" onClick={onNavigate} />
      <MenuItem href="/dashboard/messages" icon={<FaEnvelope />} label="Messages" onClick={onNavigate} />
      <MenuItem href="/dashboard/cache" icon={<FaMemory />} label="Cache" onClick={onNavigate} />
      <MenuItem href="/dashboard/users" icon={<FaUsers />} label="Users" onClick={onNavigate} />
      <MenuItem href="/dashboard/events" icon={<FaCalendarAlt />} label="Events" onClick={onNavigate} />
    </div>
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
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex flex-col items-center justify-center gap-2
        rounded-xl border border-gray-200
        bg-gray-50 py-4
        hover:bg-gray-100 transition
        text-center
      "
    >
      <span className="text-lg text-gray-700">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
