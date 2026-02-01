"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Search from "@/components/home/Search";
import TypingText from "@/components/ui/TypingText";
import banner from "@/assets/banner.jpg";
import Image from "next/image";

export default function Hero() {
    const text =
        "Discover the breathtaking beauty of Nepal through curated travel guides, cultural insights, and unforgettable experiences.";

    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <header className="relative w-full overflow-hidden bg-white" style={{ minHeight: "70vh" }}>

            {/* ── Skeleton placeholder shown until image loads ── */}
            {!imageLoaded && (
                <div className="absolute inset-0 z-10">
                    {/* Base grey */}
                    <div className="absolute inset-0 bg-gray-200" />
                    {/* Shimmer sweep */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-shimmer 1.4s ease-in-out infinite",
                        }}
                    />
                    {/* Subtle mountain silhouette hint */}
                    <svg
                        className="absolute bottom-0 left-0 w-full opacity-10"
                        viewBox="0 0 1440 200"
                        preserveAspectRatio="none"
                        style={{ height: "45%" }}
                    >
                        <path
                            fill="#374151"
                            d="M0,200 L0,140 L120,100 L200,130 L340,60 L420,90 L560,30 L680,80 L780,20 L900,70 L1020,40 L1140,90 L1260,50 L1360,100 L1440,70 L1440,200 Z"
                        />
                    </svg>
                    <style>{`
                        @keyframes skeleton-shimmer {
                            0%   { background-position: -200% 0; }
                            100% { background-position: 200% 0; }
                        }
                    `}</style>
                </div>
            )}

            {/* ── Full-width banner image ── */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={imageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <Image
                    src={banner}
                    alt="Himalayan mountain range"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 30%" }}
                    priority
                    onLoad={() => setImageLoaded(true)}
                />
            </motion.div>

            {/* ── White fade edges: top, bottom, left, right ── */}
            {/* Top */}
            <div
                className="absolute left-0 right-0 top-0 z-10 pointer-events-none"
                style={{
                    height: "25%",
                    background: "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0))",
                }}
            />
            {/* Bottom */}
            <div
                className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none"
                style={{
                    height: "35%",
                    background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0))",
                }}
            />
            {/* Left */}
            <div
                className="absolute top-0 bottom-0 left-0 z-10 pointer-events-none"
                style={{
                    width: "12%",
                    background: "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0))",
                }}
            />
            {/* Right */}
            <div
                className="absolute top-0 bottom-0 right-0 z-10 pointer-events-none"
                style={{
                    width: "12%",
                    background: "linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0))",
                }}
            />

            {/* ── Dark overlay for text legibility (sits between image and white fades) ── */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(10,18,40,0.0) 0%, rgba(10,18,40,0.15) 35%, rgba(10,18,40,0.5) 70%, rgba(10,18,40,0.65) 85%)",
                }}
            />

            {/* ── Content layer ── */}
            <div
                className="relative z-20 flex flex-col items-center justify-end w-full h-full text-center px-4 pb-12"
                style={{ minHeight: "70vh" }}
            >
                {/* Heading text */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                    className="max-w-3xl mx-auto mb-6"
                >
                    <TypingText text={text} />
                </motion.div>

                {/* Search bar — floats over the banner */}
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
                    className="hero-search-wrapper w-full max-w-2xl"
                >
                    <Search />
                </motion.section>
            </div>
        </header>
    );
}