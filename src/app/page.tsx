"use client";
import SearchBox from "@/components/SearchBox";

export default function HomePage() {
  return (
    <div className="max-w-screen-lg mx-auto py-6 px-4">
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent animate-fade-in-up"
      >
        Welcome to Beautiful Nepal
      </h1>
      <p className="mt-2 text-lg text-center text-gray-700">
        Discover the beauty of Nepal through our curated travel guides and experiences.
      </p>
      <div className="p-6">
        <SearchBox />
      </div>
    </div>
  );
}
