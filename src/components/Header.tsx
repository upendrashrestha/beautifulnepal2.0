"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dbn.png";
import DestinationDropdown from "./DestinationDropdown";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import CTAButton from "./CTAButton";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

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
  const DOT_PATTERN =
    "url(\"data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(188,28,43,0.12)'/%3E%3C/svg%3E\")";
  return (
    <>
      {/* ── Desktop / scroll header ───────────────────────────────────────── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "fixed top-0 left-0 z-50 w-full transition-all duration-400",
          stickyMenu ? "bg-[#faf7f2]/90 backdrop-blur-sm shadow-md" : { background: "#faf7f2", backgroundImage: DOT_PATTERN }
        )}
      >
        {/* Crimson bottom hairline — only when scrolled */}
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
            stickyMenu ? "opacity-100" : "opacity-0"
          )}

        />

        <div className="mx-auto flex items-center justify-between px-5 py-3 md:px-8 lg:py-3.5">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >

            <Image
              src={logo}
              alt="Beautiful Nepal Logo"
              width={80}
              height={50}
              priority
              className="relative h-auto w-16 md:w-[72px] brightness-0"
            />
          </Link>
          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav className="hidden xl:flex items-center gap-1">
            {/* Destination dropdown — inherits dark theme via CSS var overrides */}
            <DestinationDropdown />

            <Link
              href="/events"
              className={clsx(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200",
                pathname === "/events"
                  ? "bg-[#bc1c2b]/15 text-[#f08090] border border-[#bc1c2b]/30"
                  : "text-blue/65 hover:text-blue hover:bg-blue/6 border border-transparent"
              )}
              style={{ fontFamily: "var(--font-dm)" }}
            >
              <FaCalendarAlt className="w-3.5 h-3.5 opacity-80" />
              Events
            </Link>

            {/* CTA */}
            <div className="ml-2">
              <CTAButton
                label="Plan Your Trip"
                source="header"
                className={clsx(
                  "!rounded-full !px-5 !py-2 !text-sm !font-medium !border-0",
                  "!bg-[#bc1c2b] !text-white",
                  "hover:!bg-[#d93344]",
                  "shadow-[0_0_20px_rgba(188,28,43,0.35)] hover:shadow-[0_0_28px_rgba(188,28,43,0.55)]",
                  "transition-all duration-300"
                )}
              />
            </div>
          </nav>

          {/* ── Mobile burger ────────────────────────────────────────────── */}
          <button
            aria-label="Toggle Navigation"
            className="xl:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5
                       rounded-full border border-white/12 hover:border-white/25
                       hover:bg-white/6 transition-all duration-200"
            onClick={() => setNavigationOpen((p) => !p)}
          >
            {/* Animated bars */}
            <span
              className={clsx(
                "block h-px w-5 bg-black/80 transition-all duration-300",
                navigationOpen && "translate-y-[5.5px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-black/80 transition-all duration-300",
                navigationOpen && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-black/80 transition-all duration-300",
                navigationOpen && "-translate-y-[5.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navigationOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 z-[90]"
              style={{ background: "rgba(6,14,8,0.75)", backdropFilter: "blur(4px)" }}
              onClick={closeMobileMenu}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="xl:hidden fixed top-0 right-0 bottom-0 z-[100] w-[300px] flex flex-col overflow-y-auto"
              style={{
                background: "linear-gradient(160deg, #0a150d 0%, #0d1f16 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/6">
                <span
                  className="text-white/50 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-dm)" }}
                >
                  Navigate
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                             border border-white/10 hover:border-white/25 text-white/50
                             hover:text-white transition-all duration-200"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 2l12 12M14 2L2 14" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {/* Destination dropdown (mobile) */}
                <div className="rounded-xl overflow-hidden">
                  <DestinationDropdown onNavigate={closeMobileMenu} />
                </div>

                {/* Events */}
                <Link
                  href="/events"
                  onClick={closeMobileMenu}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                    pathname === "/events"
                      ? "bg-[#bc1c2b]/15 text-[#f08090] border border-[#bc1c2b]/20"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                  style={{ fontFamily: "var(--font-dm)" }}
                >
                  <span className="w-7 h-7 rounded-lg bg-[#bc1c2b]/10 flex items-center justify-center shrink-0">
                    <FaCalendarAlt className="w-3 h-3 text-[#bc1c2b]" />
                  </span>
                  Events
                </Link>
              </nav>

              {/* Drawer footer — CTA */}
              <div className="px-4 pb-8 pt-3 border-t border-white/6">
                <CTAButton
                  label="Plan Your Trip"
                  source="header"
                  onClick={closeMobileMenu}
                  className={clsx(
                    "w-full !justify-center !rounded-full !py-3 !text-sm !font-medium !border-0",
                    "!bg-[#bc1c2b] !text-white hover:!bg-[#d93344]",
                    "shadow-[0_0_20px_rgba(188,28,43,0.3)] transition-all duration-300"
                  )}
                />
                {/* Small tagline */}
                <p
                  className="text-center text-[11px] text-white/20 mt-3"
                  style={{ fontFamily: "var(--font-dm)" }}
                >
                  Discover Nepal&apos;s beauty
                </p>
              </div>

              {/* Decorative bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at bottom center, rgba(188,28,43,0.1) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}