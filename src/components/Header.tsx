"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dbn.png";
import DestinationDropdown from "./DestinationDropdown";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import CTAButton from "./CTAButton";

export default function Header() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const pathname = usePathname();

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      setStickyMenu(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setNavigationOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = navigationOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navigationOpen]);

  const closeMobileMenu = () => {
    setNavigationOpen(false);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full transition-all duration-300
        ${stickyMenu
          ? "bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-900/95"
          : "bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"}
      `}
    >
      {/* Top bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 lg:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src={logo}
            alt="Beautiful Nepal Logo"
            width={80}
            height={50}
            priority
            className="h-auto w-20"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-1">
          <DestinationDropdown />

          <Link
            href="/events"
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${pathname === "/events"
                ? "bg-primary/10 text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
            `}
          >
            <FaCalendarAlt className="text-sm" />
            Events
          </Link>

          <CTAButton
            label="Plan Your Trip"
            source="header"
            className="ml-2"
          />
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle Navigation"
          className="xl:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setNavigationOpen((p) => !p)}
        >
          <svg
            className="h-6 w-6 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            {navigationOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {navigationOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile navigation */}
      <div
        className={`
          xl:hidden fixed top-[72px] left-0 right-0 bottom-0 z-50
          bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out
          ${navigationOpen ? "translate-x-0" : "-translate-x-full"}
          overflow-y-auto
        `}
      >
        <nav className="flex flex-col gap-2 p-4">
          <DestinationDropdown onNavigate={closeMobileMenu} />

          <Link
            href="/events"
            onClick={closeMobileMenu}
            className={`
              flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all
              ${pathname === "/events"
                ? "bg-primary/10 text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
            `}
          >
            <FaCalendarAlt />
            Events
          </Link>

          <div className="mt-4 px-2">
            <CTAButton
              label="Plan Your Trip"
              source="header"
              onClick={closeMobileMenu}
              className="w-full justify-center"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}