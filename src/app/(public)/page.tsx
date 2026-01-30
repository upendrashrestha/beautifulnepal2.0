import { Metadata } from "next";
import Posts from "@/components/Posts";
import FeaturedDestination from "@/components/FeaturedDestinations";
import {
  fetchFeaturedPosts,
  fetchFeaturedDestinations
} from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import Hero from "@/components/home/Hero";
import TodaysEvents from "@/components/home/TodaysEvents";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Beautiful Nepal – Discover Culture, Travel & Experiences",
    description:
      "Discover Nepal’s breathtaking mountains, vibrant festivals, and rich culture. BeautifulNepal.com is your gateway to unforgettable experiences, travel guides, local stories, and hidden gems.",
    keywords:
      "Nepal travel, Everest, Kathmandu, Pokhara, culture, festivals, destinations, adventure, travel guide",
  });
}

export default async function HomePage() {
  const [featuredPosts, featuredDestinations] = await Promise.all([
    fetchFeaturedPosts(),
    fetchFeaturedDestinations(),
  ]);

  return (
    <main className="w-full overflow-hidden">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= TODAY'S EVENTS ================= */}
      <section className="bg-white dark:bg-gray-900">
        <TodaysEvents />
      </section>

      {/* ================= FEATURED BLOGS ================= */}
      {featuredPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-950 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Stories & Travel Inspiration
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Local stories, travel tips, festivals, and deep dives into
                Nepal’s culture and landscapes.
              </p>
            </div>

            <Posts title="" posts={featuredPosts} />
          </div>
        </section>
      )}

      {/* ================= DESTINATIONS ================= */}
      {featuredDestinations.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="w-full mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Explore Popular Destinations
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                From Himalayan trails to peaceful lakes and vibrant cities,
                discover where your next journey begins.
              </p>
            </div>

            <FeaturedDestination
              title=""
              limit={6}
              destinations={featuredDestinations}
            />
          </div>
        </section>
      )}
    </main>
  );
}
