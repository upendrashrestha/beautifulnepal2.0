"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import { FaChevronDown, FaMapPin } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function DestinationDropdown() {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathUrl = usePathname();

  useEffect(() => {
    fetchFeaturedDestinations().then(setDestinations);
  }, []);

  // Close when clicking outside (desktop)
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

  // Prevent body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`
            flex items-center gap-1 px-4 py-2 text-sm rounded-md transition
            ${pathUrl.startsWith("/destination")
              ? "text-primary"
              : "text-gray-800 hover:text-primary hover:bg-gray-100"}
          `}
          aria-expanded={open}
        >
          <FaMapPin />
          Explore Destinations
          <FaChevronDown
            className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Desktop Dropdown */}
        {open && (
          <div className="hidden md:block absolute left-0 z-50 mt-3 w-64 rounded-2xl bg-white shadow-xl">
            <ul className="py-2 divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
              {destinations.map((dest) => (
                <li key={dest._id}>
                  <Link
                    href={`/destinations/${dest.slug.current}`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/destinations"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-sm font-semibold text-gray-400 hover:text-blue-700"
                >
                  View All Destinations →
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Bottom Menu */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] rounded-t-2xl bg-white shadow-xl animate-slideUp">
            <div className="p-4 border-b">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
              <h3 className="mt-3 text-center text-base font-semibold">
                Explore Destinations
              </h3>
            </div>

            <ul className="divide-y overflow-y-auto">
              {destinations.map((dest) => (
                <li key={dest._id}>
                  <Link
                    href={`/destinations/${dest.slug.current}`}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 text-base font-medium text-gray-800"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/destinations"
                  onClick={() => setOpen(false)}
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
