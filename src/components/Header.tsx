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
  const pathUrl = usePathname();

  // Sticky header
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setNavigationOpen(false);
  }, [pathUrl]);

  // Prevent background scroll when menu open
  useEffect(() => {
    document.body.style.overflow = navigationOpen ? "hidden" : "auto";
  }, [navigationOpen]);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        stickyMenu
          ? "bg-gray-50 shadow-md dark:bg-black"
          : "bg-transparent"
      }`}
    >
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

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle Navigation"
          className="xl:hidden"
          onClick={() => setNavigationOpen(!navigationOpen)}
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

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4">
          <DestinationDropdown />
          <Link
            href="/whats-happening"
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition ${
              pathUrl === "/whats-happening"
                ? "text-primary"
                : "text-gray-800 hover:bg-gray-100 hover:text-primary"
            }`}
          >
            <FaCalendarAlt />
            What&apos;s happening?
          </Link>
          <CTAButton label="Plan Your Trip" source="header" />
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`xl:hidden fixed inset-0 top-[72px] bg-white dark:bg-black transition-transform duration-300 ${
          navigationOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-3 p-6">
          <DestinationDropdown />

          <Link
            href="/whats-happening"
            className={`flex items-center gap-2 rounded-md px-4 py-3 text-base ${
              pathUrl === "/whats-happening"
                ? "text-primary"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FaCalendarAlt />
            What&apos;s happening?
          </Link>

          <CTAButton label="Plan Your Trip" source="header" />
        </nav>
      </div>
    </header>
  );
}
