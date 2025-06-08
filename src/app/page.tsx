import AnimatedSection from "@/components/AnimatedSection";
import FeaturedDestination from "@/components/FeaturedDestinations";
import Link from "@/components/Link";
import FeaturedPost from "@/components/Posts";
import SearchBox from "@/components/SearchBox";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

  return generateMetadataHelper({
    title: "Home | Beautiful Nepal",
    description: "Discover Nepal’s breathtaking mountains, vibrant festivals, and rich culture. BeautifulNepal.com is your gateway to unforgettable experiences. Get inspired by travel guides, local stories, hidden gems, and practical tips to help you plan your next adventure in Nepal.",
    keywords: "discover, majestic, everest, mount, mountains, lukla, kathmandu, pokhara, valley, vacation, holidays, breathtaking, culture, unforgettable, experiences, guides, stories, hidden gems, tips, plan, next adventure"
  });
}

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
            <Link
              href="/whats-happening"
              className="inline-block text-sm px-5 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg ml-4 text-center"
            >
              Find out what&apos;s happening across Beautiful Nepal
            </Link>
          </section>
        </header>
      </AnimatedSection>

      <FeaturedPost featured={true} title="Featured Blogs" />



      <FeaturedDestination />

    </div>
  );
}
