"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { Destination } from "../../types";
import { FaChevronDown, FaMapPin } from "react-icons/fa";
import { usePathname } from "next/navigation";

type Props = {
  onNavigate?: () => void;
};

export default function DestinationDropdown({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathUrl = usePathname();

  useEffect(() => {
    fetchFeaturedDestinations().then(setDestinations);
  }, []);

  // Desktop outside-click ONLY
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth < 1280) return;

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

  // Prevent scroll only for mobile dropdown
  useEffect(() => {
    if (window.innerWidth < 768) {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open]);

  const handleNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <>
      {/* Trigger */}
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setOpen((p) => !p)}
          className={`
            flex items-center gap-1 px-4 py-2 text-sm rounded-md transition
            ${pathUrl.startsWith("/destination")
              ? "text-primary"
              : "text-gray-800 hover:text-primary hover:bg-gray-100"}
          `}
        >
          <FaMapPin />
          Explore Destinations
          <FaChevronDown
            className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Desktop dropdown */}
        {open && (
          <div className="hidden xl:block absolute left-0 z-50 mt-3 w-64 rounded-2xl bg-white shadow-xl">
            <ul className="divide-y max-h-[60vh] overflow-y-auto">
              {destinations.map((dest) => (
                <li key={dest._id}>
                  <Link
                    href={`/destinations/${dest.slug.current}`}
                    onClick={handleNavigate}
                    className="block px-5 py-2 text-sm hover:text-blue-600"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/destinations"
                  onClick={handleNavigate}
                  className="block px-5 py-3 font-semibold text-gray-500 hover:text-blue-600"
                >
                  View All Destinations →
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {open && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleNavigate}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] rounded-t-2xl bg-white shadow-xl">
            <div className="p-4 border-b text-center font-semibold">
              Explore Destinations
            </div>

            <ul className="divide-y overflow-y-auto">
              {destinations.map((dest) => (
                <li key={dest._id}>
                  <Link
                    href={`/destinations/${dest.slug.current}`}
                    onClick={handleNavigate}
                    className="block px-6 py-4 text-base"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/destinations"
                  onClick={handleNavigate}
                  className="block px-6 py-4 font-semibold text-blue-600"
                >
                  View All Destinations →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
