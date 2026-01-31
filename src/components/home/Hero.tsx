"use client";
import { motion } from "framer-motion";
import Search from "@/components/home/Search";
import TypingText from "@/components/ui/TypingText";

export default function Hero() {
    const text = "Discover the breathtaking beauty of Nepal through curated travel guides, cultural insights, and unforgettable experiences."

    return (
        <header className="relative flex flex-col items-center justify-center text-center overflow-hidden min-h-[70vh] px-4">

            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 1.2 }}
            />

            {/* Subtle animated orbs */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl -z-10"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
            >
                <TypingText text={text} />
            </motion.div>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="my-8 w-full max-w-3xl"
            >
                <Search />
            </motion.section>
        </header>
    );
}