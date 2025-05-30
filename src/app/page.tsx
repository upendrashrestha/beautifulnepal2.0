"use client";

import AnimatedSection from "@/components/AnimatedSection";
import FeaturedDestination from "@/components/FeaturedDestinations";
import FeaturedPost from "@/components/Posts";
import SearchBox from "@/components/SearchBox";


export default function HomePage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-16 sm:py-20">
      <AnimatedSection>
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
      </AnimatedSection>




      <FeaturedPost featured={true} title="Featured Blogs" />



      <FeaturedDestination />

    </div>
  );
}
