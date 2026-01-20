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
  }, [navigationOpen]);

  const closeMobileMenu = () => {
    setNavigationOpen(false);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full transition-all duration-300
        ${stickyMenu
          ? "bg-white shadow-md dark:bg-black"
          : "bg-transparent"}
      `}
    >
      {/* Top bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Beautiful Nepal Logo"
            width={80}
            height={50}
            priority
          />
        </Link>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle Navigation"
          className="xl:hidden"
          onClick={() => setNavigationOpen((p) => !p)}
        >
          <svg
            className="h-7 w-7 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {navigationOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-4">
          <DestinationDropdown />

          <Link
            href="/whats-happening"
            className={`
              flex items-center gap-2 rounded-md px-4 py-2 text-sm transition
              ${pathname === "/whats-happening"
                ? "text-primary"
                : "text-gray-800 hover:bg-gray-100 hover:text-primary"}
            `}
          >
            <FaCalendarAlt />
            What&apos;s happening?
          </Link>

          <CTAButton label="Plan Your Trip" source="header" />
        </nav>
      </div>

      {/* Mobile navigation */}
      <div
        className={`
          xl:hidden fixed inset-0 top-[72px] z-40
          bg-white dark:bg-black
          transition-transform duration-300
          ${navigationOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex flex-col gap-4 p-6">
          {/* Destination dropdown (closes menu on navigate) */}
          <DestinationDropdown onNavigate={closeMobileMenu} />

          <Link
            href="/whats-happening"
            onClick={closeMobileMenu}
            className={`
              flex items-center gap-2 rounded-md px-4 py-3 text-base
              ${pathname === "/whats-happening"
                ? "text-primary"
                : "text-gray-800 hover:bg-gray-100"}
            `}
          >
            <FaCalendarAlt />
            What&apos;s happening?
          </Link>

          <CTAButton
            label="Plan Your Trip"
            source="header"
            onClick={closeMobileMenu}
          />
        </nav>
      </div>
    </header>
  );
}
