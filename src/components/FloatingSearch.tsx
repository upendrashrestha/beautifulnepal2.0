"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiSearchLine, RiCloseLine, RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";
import { SearchQueryResult } from "../../types";

/* ─────────────────────────────────────────────────────────────────────────────
   Inline Search — lives inside the modal (not the page)
───────────────────────────────────────────────────────────────────────────── */
function ModalSearch({ onClose }: { onClose: () => void }) {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState<SearchQueryResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-focus on open
    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 120);
        return () => clearTimeout(t);
    }, []);

    const search = useCallback(async (q: string) => {
        if (!q.trim()) { setResults(null); setLoading(false); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
            const data = await res.json();
            setResults(data);
        } catch {
            setResults(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce as-you-type
    useEffect(() => {
        if (!touched) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(term), 380);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [term, touched, search]);

    const allResults = results
        ? [...results.posts, ...results.guides, ...results.destinations, ...results.categories]
        : [];

    const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
        posts:              { bg: "rgba(188,28,43,0.1)",   text: "#bc1c2b" },
        guides:             { bg: "rgba(180,110,20,0.12)", text: "#a86c10" },
        destinations:       { bg: "rgba(30,110,60,0.12)",  text: "#1e7a42" },
        categories:         { bg: "rgba(70,70,160,0.1)",   text: "#5a5ab0" },
        "whats-happening":  { bg: "rgba(20,100,180,0.1)",  text: "#1a6abf" },
    };

    const typeLabel = (t: string) => t === "whats-happening" ? "Event" :
        t.charAt(0).toUpperCase() + t.slice(1).replace(/s$/, "");

    return (
        <div className="flex flex-col h-full">

            {/* ── Input bar ─────────────────────────────────────────────── */}
            <div
                className="flex items-center gap-3 px-5 py-4 border-b"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
                <RiSearchLine
                    className="w-5 h-5 shrink-0 transition-colors duration-200"
                    style={{ color: term ? "#bc1c2b" : "rgba(0,0,0,0.3)" }}
                />
                <input
                    ref={inputRef}
                    value={term}
                    onChange={(e) => { setTerm(e.target.value); setTouched(true); }}
                    onKeyDown={(e) => e.key === "Enter" && search(term)}
                    placeholder="Search destinations, guides, blogs…"
                    className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-black/30
                     focus:outline-none"
                    style={{ fontFamily: "var(--font-dm)" }}
                />
                {term && (
                    <button
                        onClick={() => { setTerm(""); setResults(null); inputRef.current?.focus(); }}
                        className="w-6 h-6 rounded-full flex items-center justify-center
                       text-black/30 hover:text-black/60 hover:bg-black/6 transition-all"
                        aria-label="Clear"
                    >
                        <RiCloseLine className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Results area ──────────────────────────────────────────── */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain px-2 py-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#bc1c2b transparent" }}
            >

                {/* Loading skeletons */}
                {loading && (
                    <div className="space-y-2 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl p-4 animate-pulse"
                                style={{ background: "rgba(0,0,0,0.04)" }}>
                                <div className="h-3.5 w-3/4 rounded-full mb-2"
                                    style={{ background: "rgba(0,0,0,0.08)" }} />
                                <div className="h-2.5 w-1/4 rounded-full"
                                    style={{ background: "rgba(0,0,0,0.05)" }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Results */}
                {!loading && allResults.length > 0 && (
                    <motion.ul
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                        className="space-y-1 p-1"
                    >
                        {allResults.map((item) => {
                            const itemType = item.type ?? "categories";
                            const style = TYPE_COLORS[itemType] ?? TYPE_COLORS.categories;
                            const label = typeLabel(itemType);
                            const title = "title" in item ? item.title : item.name;
                            const href = `/${item.type === "whats-happening" ? "events" : item.type}/${item.slug?.current}`;

                            return (
                                <motion.li
                                    key={item._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 8 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                >
                                    <Link
                                        href={href}
                                        onClick={onClose}
                                        className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                                        style={{ background: "transparent" }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.04)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                        }}
                                    >
                                        {/* Type dot */}
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                                            style={{ background: style.text }}
                                        />

                                        {/* Title */}
                                        <p
                                            className="flex-1 text-[15px] text-gray-700 group-hover:text-gray-900
                                 line-clamp-1 transition-colors"
                                            style={{ fontFamily: "var(--font-dm)" }}
                                        >
                                            {title}
                                        </p>

                                        {/* Type badge */}
                                        <span
                                            className="shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                                            style={{
                                                background: style.bg,
                                                color: style.text,
                                                fontFamily: "var(--font-dm)",
                                            }}
                                        >
                                            {label}
                                        </span>

                                        <RiArrowRightSLine
                                            className="w-4 h-4 shrink-0 text-black/20
                                 group-hover:text-black/50 group-hover:translate-x-0.5
                                 transition-all duration-200"
                                        />
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                )}

                {/* Empty state */}
                {!loading && touched && term && results && allResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                        <p className="text-sm text-gray-400" style={{ fontFamily: "var(--font-dm)" }}>
                            No results found for{" "}
                            <span className="text-gray-600 italic">&ldquo;{term}&rdquo;</span>
                        </p>
                    </div>
                )}

                {/* Idle hint */}
                {!touched && (
                    <div className="px-4 pt-6 pb-2">
                        <p
                            className="text-[11px] tracking-[0.18em] uppercase text-black/30 mb-4"
                            style={{ fontFamily: "var(--font-dm)" }}
                        >
                            Quick links
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Trekking", "Kathmandu", "Pokhara", "Everest", "Festivals", "Safari"].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => { setTerm(tag); setTouched(true); }}
                                    className="text-[13px] px-3 py-1.5 rounded-full border transition-all duration-200
                             text-gray-500 hover:text-gray-800 border-black/10 hover:border-black/25
                             hover:bg-black/5"
                                    style={{ fontFamily: "var(--font-dm)" }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main — Floating button + portal modal
───────────────────────────────────────────────────────────────────────────── */
export default function FloatingSearch() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Lock body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <>
            {/* ── Floating button ────────────────────────────────────────── */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => setOpen(true)}
                aria-label="Open search"
                className="fixed bottom-6 right-6 z-40 group"
                style={{ filter: "drop-shadow(0 8px 24px rgba(188,28,43,0.45))" }}
            >
                {/* Pulse ring */}
                <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                        background: "rgba(188,28,43,0.3)",
                        animationDuration: "2.4s",
                    }}
                />

                {/* Button body */}
                <span
                    className="relative flex items-center justify-center w-14 h-14 rounded-full
                     transition-all duration-300
                     group-hover:scale-110 group-hover:shadow-[0_0_36px_rgba(188,28,43,0.7)]"
                    style={{
                        background: "linear-gradient(135deg, #bc1c2b 0%, #8f1420 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                    }}
                >
                    <RiSearchLine className="w-5 h-5 text-white" />
                </span>

                {/* Keyboard hint tooltip — desktop only */}
                <span
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2
                     hidden md:flex items-center gap-1.5
                     opacity-0 group-hover:opacity-100 pointer-events-none
                     transition-all duration-200 -translate-x-1 group-hover:translate-x-0
                     text-[11px] text-white/50 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-dm)" }}
                >
                    <kbd
                        className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        ⌘K
                    </kbd>
                    to search
                </span>
            </motion.button>

            {/* ── Modal portal ────────────────────────────────────────────── */}
            {mounted && createPortal(
                <AnimatePresence>
                    {open && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="search-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={close}
                                className="fixed inset-0 z-[200]"
                                style={{
                                    background: "rgba(20,30,25,0.55)",
                                    backdropFilter: "blur(8px)",
                                }}
                            />

                            {/* Modal panel */}
                            <motion.div
                                key="search-panel"
                                initial={{ opacity: 0, y: -24, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="fixed z-[210] inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2
                           top-[8vh] md:top-[12vh] md:w-[620px] lg:w-[700px]
                           flex flex-col overflow-hidden"
                                style={{
                                    maxHeight: "72vh",
                                    background: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: "20px",
                                    boxShadow:
                                        "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(188,28,43,0.12)",
                                }}
                            >
                                {/* Crimson top accent */}
                                <div
                                    className="absolute top-0 left-8 right-8 h-px"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, transparent, #bc1c2b, transparent)",
                                    }}
                                />

                                {/* Close button */}
                                <button
                                    onClick={close}
                                    className="absolute top-3.5 right-4 w-7 h-7 flex items-center justify-center
                             rounded-full text-black/30 hover:text-black/60 hover:bg-black/6
                             transition-all duration-200 z-10"
                                    aria-label="Close search"
                                >
                                    <RiCloseLine className="w-4 h-4" />
                                </button>

                                {/* Search UI */}
                                <ModalSearch onClose={close} />

                                {/* Footer hint */}
                                <div
                                    className="flex items-center justify-between px-5 py-2.5 border-t"
                                    style={{ borderColor: "rgba(0,0,0,0.07)" }}
                                >
                                    <span
                                        className="text-[11px] text-black/30"
                                        style={{ fontFamily: "var(--font-dm)" }}
                                    >
                                        Beautiful Nepal
                                    </span>
                                    <div
                                        className="flex items-center gap-3 text-[11px] text-black/30"
                                        style={{ fontFamily: "var(--font-dm)" }}
                                    >
                                        <span>
                                            <kbd
                                                className="opacity-60 px-1 py-0.5 rounded text-[10px]"
                                                style={{
                                                    background: "rgba(0,0,0,0.06)",
                                                    border: "1px solid rgba(0,0,0,0.1)",
                                                }}
                                            >↑↓</kbd>{" "}navigate
                                        </span>
                                        <span>
                                            <kbd
                                                className="opacity-60 px-1 py-0.5 rounded text-[10px]"
                                                style={{
                                                    background: "rgba(0,0,0,0.06)",
                                                    border: "1px solid rgba(0,0,0,0.1)",
                                                }}
                                            >↵</kbd>{" "}open
                                        </span>
                                        <span>
                                            <kbd
                                                className="opacity-60 px-1 py-0.5 rounded text-[10px]"
                                                style={{
                                                    background: "rgba(0,0,0,0.06)",
                                                    border: "1px solid rgba(0,0,0,0.1)",
                                                }}
                                            >esc</kbd>{" "}close
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}