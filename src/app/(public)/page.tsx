import FeaturedDestination from "@/components/FeaturedDestinations";
import FeaturedPost from "@/components/Posts";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { Metadata } from "next";
import HeroHeader from "../heroHeader";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    title: "Home | Beautiful Nepal",
    description:
      "Discover Nepal’s breathtaking mountains, vibrant festivals, and rich culture. BeautifulNepal.com is your gateway to unforgettable experiences. Get inspired by travel guides, local stories, hidden gems, and practical tips to help you plan your next adventure in Nepal.",
    keywords:
      "discover, majestic, everest, mount, mountains, lukla, kathmandu, pokhara, valley, vacation, holidays, breathtaking, culture, unforgettable, experiences, guides, stories, hidden gems, tips, plan, next adventure",
  });
}

export default function HomePage() {
  return (
    <div className="mx-auto px-4 py-16 sm:py-20">
      <HeroHeader />
      <FeaturedPost featured={true} title="Featured Blogs" />
      <FeaturedDestination title="Popular Destinations" />
    </div>
  );
}
