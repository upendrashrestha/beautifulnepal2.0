"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import TypingText from "@/components/ui/TypingText";

export default function HeroHeader() {
    const text = "  Discover the breathtaking beauty of Nepal through curated travel guides, cultural insights, and unforgettable experiences."
    return (
        <header className="relative flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 -z-10" />

            {/* Animated title */}
            {/* <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 via-pink-600 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm"
            >
                Welcome to Beautiful Nepal
            </motion.h1> */}

            {/* Subtitle */}
            {/* <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
                Discover the breathtaking beauty of Nepal through curated travel guides,
                cultural insights, and unforgettable experiences.
            </motion.p> */}
<TypingText text={text}/>

            {/* Search box */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="my-6 w-full"
            >
                <SearchBox />
            </motion.section>

            {/* CTA Button */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="my-10 flex justify-center"
            >
                <Link
                    href="/whats-happening"
                    className="inline-block px-6 py-3 rounded-full font-semibold bg-black text-gray-400 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                    Explore What’s Happening Across Nepal
                </Link>
            </motion.section>
        </header>
    );
}
