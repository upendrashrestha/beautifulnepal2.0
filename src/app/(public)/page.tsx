// app/page.tsx
import { Metadata } from "next";
import HeroHeader from "../heroHeader";
import Posts from "@/components/Posts";
import FeaturedDestination from "@/components/FeaturedDestinations";
import { fetchFeaturedPosts, fetchFeaturedDestinations } from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Home",
    description:
      "Discover Nepal’s breathtaking mountains, vibrant festivals, and rich culture. BeautifulNepal.com is your gateway to unforgettable experiences. Get inspired by travel guides, local stories, hidden gems, and practical tips to help you plan your next adventure in Nepal.",
    keywords:
      "discover, majestic, everest, mount, mountains, lukla, kathmandu, pokhara, valley, vacation, holidays, breathtaking, culture, unforgettable, experiences, guides, stories, hidden gems, tips, plan, next adventure",
  });
}


export default async function HomePage() {
  // ------------------------
  // Fetch all data in parallel
  // ------------------------
  const [featuredPosts, featuredDestinations] = await Promise.all([
    fetchFeaturedPosts(),
    fetchFeaturedDestinations(),
  ]);

  return (
    <div className="mx-auto px-4 py-16 sm:py-20">
      {/* Hero Section */}
      <HeroHeader />

      {/* Featured Blogs */}
      {featuredPosts.length > 0 && (
        <Posts title="Featured Blogs" posts={featuredPosts} />
      )}

      {/* Popular Destinations */}
      {featuredDestinations.length > 0 && (
        <FeaturedDestination
          title="Popular Destinations"
          limit={6}
          destinations={featuredDestinations}
        />
      )}
    </div>
  );
}
