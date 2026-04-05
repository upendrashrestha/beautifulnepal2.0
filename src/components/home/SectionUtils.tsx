"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface SectionHeadingProps {
    index: string;
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle?: string;
    light?: boolean;
}

export function SectionHeading({
    index,
    eyebrow,
    title,
    titleAccent,
    subtitle,
    light = false,
}: SectionHeadingProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    const textPrimary = light ? "text-white" : "text-[#1a1814]";
    const textSecondary = light ? "text-white/30" : "text-[#8a8378]";
    const borderCol = light ? "border-white/10" : "border-[#e2ddd4]";

    return (
        <div ref={ref} className="mb-14" key={index}>
            {/* Index + eyebrow row */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-5"
            >
                {/* <span
                    className="text-[#bc1c2b] font-light select-none"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,4.5rem)", lineHeight: 1, opacity: 0.25 }}
                >
                    {index}
                </span> */}
                <span
                    className="text-[10px] tracking-[0.22em] uppercase text-[#bc1c2b]"
                    style={{ fontFamily: "var(--font-dm)", fontSize: "clamp(3rem,6vw,4.5rem)" }}
                >
                    {eyebrow}
                </span>
                <div className={`flex-1 h-px ${borderCol}`} />

            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`font-light leading-[1.05] ${textPrimary}`}
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem,5vw,3.75rem)" }}
            >
                {title}{" "}
                {titleAccent && (
                    <em className="italic not-italic" style={{ color: "#c9943a" }}>
                        {titleAccent}
                    </em>
                )}
            </motion.h2>

            {/* Subtitle */}
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className={`mt-3 text-base leading-relaxed max-w-xl ${textSecondary}`}
                    style={{ fontFamily: "var(--font-dm)" }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}

/** Diagonal SVG divider — points down into the next section */
export function DiagonalDivider({ fromColor, toColor }: { fromColor: string; toColor: string }) {
    return (
        <div className="relative h-16 -mb-px overflow-hidden" style={{ background: fromColor }}>
            <svg
                viewBox="0 0 1440 64"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ fill: toColor }}
            >
                <path d="M0 0 L1440 64 L1440 64 L0 64 Z" />
            </svg>
        </div>
    );
}

/** Decorative ornament line between sections */
export function Ornament({ light = false }: { light?: boolean }) {
    const col = light ? "rgba(255,255,255,0.12)" : "rgba(188,28,43,0.15)";
    return (
        <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px" style={{ background: col }} />
            <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="3" y="3" width="6" height="6" fill="#bc1c2b" opacity="0.5" transform="rotate(45 6 6)" />
            </svg>
            <div className="flex-1 h-px" style={{ background: col }} />
        </div>
    );
}