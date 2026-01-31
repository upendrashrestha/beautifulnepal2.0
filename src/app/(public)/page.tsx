import { Metadata } from "next";
import Posts from "@/components/Posts";
import FeaturedDestination from "@/components/home/FeaturedDestinations";
import Guides from "@/components/Guides";
import {
  fetchFeaturedPosts,
  fetchFeaturedDestinations,
  fetchFeaturedGuides
} from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import Hero from "@/components/home/Hero";
import TodaysEvents from "@/components/home/TodaysEvents";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Beautiful Nepal – Discover Culture, Travel & Experiences",
    description:
      "Discover Nepal's breathtaking mountains, vibrant festivals, and rich culture. BeautifulNepal.com is your gateway to unforgettable experiences, travel guides, local stories, and hidden gems.",
    keywords:
      "Nepal travel, Everest, Kathmandu, Pokhara, culture, festivals, destinations, adventure, travel guide",
  });
}

export default async function HomePage() {
  const [featuredPosts, featuredDestinations, featuredGuides] = await Promise.all([
    fetchFeaturedPosts(),
    fetchFeaturedDestinations(),
    fetchFeaturedGuides(),
  ]);

  return (
    <main className="w-full overflow-hidden">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= TODAY'S EVENTS ================= */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <TodaysEvents />
      </section>

      {/* ================= FEATURED BLOGS ================= */}
      {featuredPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-950 py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Stories & Travel Inspiration
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Local stories, travel tips, festivals, and deep dives into
                Nepal&apos;s culture and landscapes.
              </p>
            </div>

            <Posts title="" posts={featuredPosts} />
          </div>
        </section>
      )}

      {/* ================= GUIDES ================= */}
      {featuredGuides.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Expert Travel Guides
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Comprehensive guides to help you plan the perfect journey through Nepal.
              </p>
            </div>

            <Guides guides={featuredGuides} title="" />
          </div>
        </section>
      )}

      {/* ================= DESTINATIONS ================= */}
      {featuredDestinations.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Popular Destinations
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
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