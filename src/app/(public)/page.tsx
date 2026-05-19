import { Metadata } from "next";
import { redirect } from "next/navigation";

import Posts from "@/components/Posts";
import FeaturedDestination from "@/components/home/FeaturedDestinations";
import Guides from "@/components/Guides";
import Events from "@/components/home/Events";

import {
  fetchFeaturedPosts,
  fetchFeaturedDestinations,
  fetchFeaturedGuides,
} from "@/sanity/lib/fetch";

import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import {
  SectionReveal,
  SectionHeading
} from "@/components/home/SectionUtils";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

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

/* ─────────────────────────────────────────────────────────────────────────────
   Inline SVG backgrounds — zero images, pure CSS / SVG
───────────────────────────────────────────────────────────────────────────── */

/** Subtle dot-grid pattern */

/** Fine crosshatch pattern */
const CROSSHATCH =
  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L20 20M20 0L0 20' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3C/svg%3E\")";

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  try {
    const [featuredPosts, featuredDestinations, featuredGuides] =
      await Promise.all([
        fetchFeaturedPosts(),
        fetchFeaturedDestinations(),
        fetchFeaturedGuides(),
      ]);

    return (
      <main className="w-full overflow-hidden" style={{ fontFamily: "var(--font-dm)" }}>

        {/* ══════════════════════════════════════════════
            01 · HERO
        ══════════════════════════════════════════════ */}
        {/* <Hero /> */}

        {/* ══════════════════════════════════════════════
            02 · EVENTS
            Dark forest section with diagonal top edge
        ══════════════════════════════════════════════ */}
     

          {/* Top-left decorative rule */}
<section className="relative py-4 md:py-6 lg:py-8">
  {/* Top gradient line */}
  <div className="absolute top-0 left-0 right-0 h-px"
    style={{ background: "linear-gradient(90deg, #bc1c2b, rgba(188,28,43,0.15), transparent)" }} />

  <div className="container mx-auto px-4 relative z-10">
 

    {/* Modern header with floating button */}
    <div className="mt-12 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionReveal>
      <SectionHeading
        index="02"
        eyebrow="What's On"
        title="Events across"
        titleAccent="Nepal"
        subtitle="Don't miss out on what's happening — festivals, treks, and cultural gatherings across the country."
      />
    </SectionReveal>

        <SectionReveal delay={0.1}>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-700 font-medium hover:border-[#bc1c2b]/30 hover:bg-[#bc1c2b]/5 transition-all duration-300"
          >
            <FaCalendarAlt className="w-4 h-4 text-[#bc1c2b]" />
            View All Events
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </SectionReveal>
      </div>
    </div>

    {/* Events Grid */}
    <SectionReveal delay={0.15}>
      <Events />
    </SectionReveal>
  </div>
</section>

        {/* ══════════════════════════════════════════════
            03 · STORIES & TRAVEL INSPIRATION
            Warm cream — editorial magazine layout
        ══════════════════════════════════════════════ */}
        {featuredPosts.length > 0 && (
          <section
            className="relative py-20 sm:py-28"
            style={{ background: "#faf7f2" }}
          >
            {/* Gold ambient blob */}
            <div
              className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
              style={{
                background: "radial-gradient(circle at bottom right, rgba(201,148,58,0.06) 0%, transparent 65%)",
              }}
            />

            {/* Top-left decorative rule */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, #bc1c2b, rgba(188,28,43,0.15), transparent)" }} />

            <div className="container mx-auto px-4 relative z-10">
              <SectionReveal>
                <SectionHeading
                  index="03"
                  eyebrow="Latest Stories"
                  title="Stories & Travel"
                  titleAccent="Inspiration"
                  subtitle="Local stories, travel tips, festivals, and deep dives into Nepal's culture and landscapes."
                />
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <Posts title="" posts={featuredPosts} />
              </SectionReveal>

            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            04 · EXPERT TRAVEL GUIDES
            Deep charcoal — premium editorial feel
        ══════════════════════════════════════════════ */}
        {featuredGuides.length > 0 && (
          <section
            className="relative py-20 sm:py-28"
            style={{ background: "#faf7f2" }}
          >
            {/* Gold ambient blob */}
            <div
              className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
              style={{
                background: "radial-gradient(circle at bottom right, rgba(201,148,58,0.06) 0%, transparent 65%)",
              }}
            />

            {/* Top-left decorative rule */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, #bc1c2b, rgba(188,28,43,0.15), transparent)" }} />

            <div className="container mx-auto px-4 relative z-10">
              <SectionReveal>
                <SectionHeading
                  index="04"
                  eyebrow="Plan Your Journey"
                  title="Expert Travel"
                  titleAccent="Guides"
                  subtitle="Comprehensive guides to help you plan the perfect journey through Nepal — written by people who've been there."

                />
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <Guides guides={featuredGuides} title="" />
              </SectionReveal>
            </div>

          </section>
        )}

        {/* ══════════════════════════════════════════════
            05 · DESTINATIONS
            Dark forest — the grand finale
        ══════════════════════════════════════════════ */}
        {featuredDestinations.length > 0 && (
          <section
            className="relative pt-4 pb-24 sm:pb-32"

          >
            {/* Cross-hatch */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: CROSSHATCH }}
            />

            {/* Twin crimson glows */}
            <div
              className="absolute top-1/4 left-0 w-[400px] h-[400px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(188,28,43,0.06) 0%, transparent 70%)" }}
            />
            {/* <div
              className="absolute bottom-1/4 right-0 w-[500px] h-[500px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(201,148,58,0.05) 0%, transparent 70%)" }}
            /> */}

            {/* Vertical center hairline */}
            {/* <div
              className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none hidden lg:block"
              style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent 100%)" }}
            /> */}

            <div className="container mx-auto px-4 relative z-10">
              <SectionReveal>
                <SectionHeading
                  index="05"
                  eyebrow="Where to Go"
                  title="Popular"
                  titleAccent="Destinations"
                  subtitle="From Himalayan trails to peaceful lakes and vibrant cities — discover where your next journey begins."
                />
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <FeaturedDestination
                  title=""
                  limit={6}
                  destinations={featuredDestinations}
                />
              </SectionReveal>
            </div>


          </section>
        )}

      </main>
    );
  } catch (error) {
    console.error("Homepage Sanity error:", error);
    redirect("/traffic-limit");
  }
}