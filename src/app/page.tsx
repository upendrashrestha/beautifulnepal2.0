"use client";

import FeaturedDestination from "@/components/FeaturedDestinations";
import FeaturedPost from "@/components/Posts";
import SearchBox from "@/components/SearchBox";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-16 sm:py-20">
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            x: -20,
          },

          visible: {
            opacity: 1,
            x: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top relative mx-auto hidden h-auto md:block md:w-full"
      >
        <header className="text-center min-h-screen">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-up">
            Welcome to Beautiful Nepal
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in delay-200">
            Discover the beauty of Nepal through our curated travel guides and experiences.
          </p>
          <section className="animate-fade-in-up delay-300">
            <SearchBox />
          </section>
        </header>
      </motion.div>




      <FeaturedPost featured={true} title="Featured Blogs" />



      <FeaturedDestination />

    </div>
  );
}
