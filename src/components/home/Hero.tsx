"use client";
import { motion } from "framer-motion";
import Search from "@/components/home/Search";
import TypingText from "@/components/ui/TypingText";

export default function Hero() {
    const text = "  Discover the breathtaking beauty of Nepal through curated travel guides, cultural insights, and unforgettable experiences."
    return (
        <header className="relative flex flex-col items-center justify-center text-center overflow-hidden">
           
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 -z-10" />

          
<TypingText text={text}/>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="my-6 w-full"
            >
                <Search />
            </motion.section>
        </header>
    );
}
