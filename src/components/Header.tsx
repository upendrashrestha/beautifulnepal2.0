"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dbn.png";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaCalendarAlt, FaChevronDown, FaMapPin, FaSearch, FaGlobe, FaMountain, FaTree, FaWater, FaLandmark, FaCompass, FaHiking } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { Destination } from "../../types";

// Helper to get category from destination name or type
const getDestinationCategory = (dest: Destination): string => {
  const name = dest.name.toLowerCase();
  if (name.includes("trek") || name.includes("everest") || name.includes("annapurna") || name.includes("base camp")) return "Trekking & Adventure";
  if (name.includes("kathmandu") || name.includes("bhaktapur") || name.includes("patan") || name.includes("durbar")) return "Cultural Heritage";
  if (name.includes("chitwan") || name.includes("bardia") || name.includes("wildlife") || name.includes("jungle")) return "Wildlife & Nature";
  if (name.includes("pokhara") || name.includes("lake") || name.includes("river")) return "Lakes & Scenery";
  if (name.includes("lumbini") || name.includes("temple") || name.includes("monastery")) return "Spiritual Sites";
  if (name.includes("mustang") || name.includes("manang") || name.includes("lo manthang")) return "Off the Beaten Path";
  return "Featured Destinations";
};

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Trekking & Adventure": <FaHiking className="w-3.5 h-3.5" />,
  "Cultural Heritage": <FaLandmark className="w-3.5 h-3.5" />,
  "Wildlife & Nature": <FaTree className="w-3.5 h-3.5" />,
  "Lakes & Scenery": <FaWater className="w-3.5 h-3.5" />,
  "Spiritual Sites": <FaGlobe className="w-3.5 h-3.5" />,
  "Off the Beaten Path": <FaMountain className="w-3.5 h-3.5" />,
  "Featured Destinations": <FaCompass className="w-3.5 h-3.5" />,
  default: <FaMapPin className="w-3.5 h-3.5" />,
};

function DestinationDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathUrl = usePathname();

  useEffect(() => {
    fetchFeaturedDestinations()
      .then((data) => {
        setDestinations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch destinations:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth >= 1280 && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      document.body.style.overflow = open ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedDestinations = filteredDestinations.reduce((acc, dest) => {
    const category = getDestinationCategory(dest);
    if (!acc[category]) acc[category] = [];
    acc[category].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className={clsx(
          "group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          pathUrl.startsWith("/destination")
            ? "bg-[#bc1c2b]/10 text-[#bc1c2b]"
            : "text-gray-700 hover:bg-gray-100/80 hover:text-[#bc1c2b]",
          open && "bg-gray-100/80 text-[#bc1c2b]"
        )}
      >
        <FaCompass className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span>Destinations</span>
        <FaChevronDown
          className={clsx(
            "w-3 h-3 transition-all duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden xl:block absolute right-0 top-full mt-2 w-[560px] z-50"
          >
            <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:border-[#bc1c2b]/30 focus:ring-2 focus:ring-[#bc1c2b]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[#bc1c2b]/20 border-t-[#bc1c2b] rounded-full animate-spin" />
                  </div>
                ) : Object.keys(groupedDestinations).length > 0 ? (
                  Object.entries(groupedDestinations).map(([category, items]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <div className="px-2 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          {categoryIcons[category] || categoryIcons.default}
                          {category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {items.map((dest) => (
                          <Link
                            key={dest._id}
                            href={`/destinations/${dest.slug.current}`}
                            onClick={handleNavigate}
                            className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bc1c2b]/10 to-[#bc1c2b]/5 flex items-center justify-center shrink-0">
                              <FaMapPin className="w-3.5 h-3.5 text-[#bc1c2b]/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-700 group-hover/item:text-[#bc1c2b] block truncate">
                                {dest.name}
                              </span>
                              {dest.intro && (
                                <p className="text-xs text-gray-400 truncate">{dest.intro.slice(0, 50)}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    {searchQuery ? "No destinations found" : "No featured destinations available"}
                  </div>
                )}
              </div>

              <Link
                href="/destinations"
                onClick={handleNavigate}
                className="block p-3 text-center text-sm font-medium text-[#bc1c2b] bg-gray-50/50 hover:bg-gray-100 transition-colors border-t border-gray-100"
              >
                View All Destinations →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="xl:hidden fixed inset-0 z-[100]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleNavigate}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-5 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaCompass className="text-[#bc1c2b]" />
                  Explore Destinations
                </h3>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:border-[#bc1c2b]/30 focus:ring-2 focus:ring-[#bc1c2b]/10 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[55vh] p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[#bc1c2b]/20 border-t-[#bc1c2b] rounded-full animate-spin" />
                  </div>
                ) : Object.keys(groupedDestinations).length > 0 ? (
                  Object.entries(groupedDestinations).map(([category, items]) => (
                    <div key={category} className="mb-3">
                      <div className="px-3 py-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          {categoryIcons[category] || categoryIcons.default}
                          {category}
                        </span>
                      </div>
                      {items.map((dest) => (
                        <Link
                          key={dest._id}
                          href={`/destinations/${dest.slug.current}`}
                          onClick={handleNavigate}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl active:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#bc1c2b]/10 to-[#bc1c2b]/5 flex items-center justify-center shrink-0">
                            <FaMapPin className="w-4 h-4 text-[#bc1c2b]/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-medium text-gray-700 block truncate">{dest.name}</span>
                            {dest.intro && (
                              <p className="text-xs text-gray-400 truncate">{dest.intro.slice(0, 60)}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {searchQuery ? "No destinations found" : "No featured destinations available"}
                  </div>
                )}
              </div>

              <Link
                href="/destinations"
                onClick={handleNavigate}
                className="block p-4 text-center text-sm font-semibold text-white bg-[#bc1c2b] hover:bg-[#a01825] transition-colors"
              >
                View All Destinations →
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CTAButton({ label, onClick, className }: { label: string; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        "bg-gradient-to-r from-[#bc1c2b] to-[#d93344] text-white",
        "hover:shadow-lg hover:shadow-[#bc1c2b]/30 hover:scale-[1.02]",
        "active:scale-98",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <FaCompass className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
      </span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/20 to-transparent" />
    </button>
  );
}

export default function Header() {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setNavigationOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navigationOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navigationOpen]);

  const closeMobileMenu = () => setNavigationOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "fixed top-0 left-0 z-50 w-full transition-all duration-400",
          stickyMenu
            ? "bg-[#faf7f2]/95 backdrop-blur-md shadow-sm"
            : "bg-[#faf7f2]"
        )}
      >
        <div className="mx-auto flex items-center justify-between px-5 py-3 md:px-8 lg:py-3.5">
          {/* Logo - Left aligned, large, no background circle */}
          <Link
            href="/"
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Image
              src={logo}
              alt="Beautiful Nepal Logo"
              width={120}
              height={80}
              priority
              className="relative h-auto w-24 md:w-32 brightness-0 object-contain"
            />
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <nav className="hidden xl:flex items-center gap-1">
            <DestinationDropdown />
            <Link
              href="/events"
              className={clsx(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/events"
                  ? "bg-[#bc1c2b]/10 text-[#bc1c2b]"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-[#bc1c2b]"
              )}
            >
              <FaCalendarAlt className="w-3.5 h-3.5" />
              Events
            </Link>
            <div className="ml-2">
              <CTAButton label="Plan Your Trip" />
            </div>
          </nav>

          {/* Mobile Menu Button - Right aligned */}
          <button
            aria-label="Toggle Navigation"
            className="xl:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/80 shadow-sm border border-gray-100 hover:bg-white transition-all duration-200"
            onClick={() => setNavigationOpen(prev => !prev)}
          >
            <span
              className={clsx(
                "block h-px w-5 bg-gray-700 transition-all duration-300",
                navigationOpen && "translate-y-[5.5px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-gray-700 transition-all duration-300",
                navigationOpen && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-gray-700 transition-all duration-300",
                navigationOpen && "-translate-y-[5.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {navigationOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="xl:hidden fixed top-0 right-0 bottom-0 z-[100] w-[85%] max-w-[320px] flex flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Image src={logo} alt="Logo" width={40} height={40} className="brightness-0" />
                  <span className="text-sm font-semibold text-gray-800">Menu</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 2l12 12M14 2L2 14" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-3 py-4">
                <DestinationDropdown onNavigate={closeMobileMenu} />
                <Link
                  href="/events"
                  onClick={closeMobileMenu}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 mt-1 text-sm font-medium transition-all",
                    pathname === "/events"
                      ? "bg-[#bc1c2b]/10 text-[#bc1c2b]"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaCalendarAlt className="w-3.5 h-3.5" />
                  </div>
                  Events
                </Link>
              </nav>

              <div className="p-4 border-t border-gray-100">
                <CTAButton label="Plan Your Trip" onClick={closeMobileMenu} className="w-full justify-center" />
                <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wide">
                  Discover Nepal&apos;s Beauty
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}