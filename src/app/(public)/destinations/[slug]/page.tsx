import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  fetchDestinationBySlug, 
  fetchGuidesByDestination, 
  fetchPostsByDestination 
} from "@/sanity/lib/fetch";
import { generateMetadataHelper } from "@/utils/generateMetadataHelper";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import SocialShare from "@/components/SocialShare";
import PageLayout from "@/components/layouts/PageLayout";
import BlockContent from "@/components/ui/blockContent";
import Posts from "@/components/Posts";
import Guides from "@/components/Guides";


interface Props {
  params: Promise<{ slug: string }>;
}
// ---------------------------
// Metadata for SEO
// ---------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await fetchDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination not found", description: "" };
  }

  const openGraphImageUrl = destination.heroImage
    ? urlFor(destination.heroImage.asset._ref).url()
    : undefined;

  return generateMetadataHelper({
    title: destination.name,
    description: destination.intro || "",
    openGraphImageUrl,
    keywords: "destination, explore, location, city, village, local, experience",
  });
}

// ---------------------------
// Destination Page
// ---------------------------
export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;

  // Fetch all required data server-side
  const [destination, relatedPosts, relatedGuides] = await Promise.all([
    fetchDestinationBySlug(slug),
    fetchPostsByDestination(slug),
    fetchGuidesByDestination(slug),
  ]);

  if (!destination) return notFound();

  // Memoized hero image URL
  const heroImageUrl = destination.heroImage
    ? urlFor(destination.heroImage.asset._ref).width(1200).height(800).url()
    : undefined;

  return (
    <PageLayout title={destination.name}>
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <SocialShare />

        {/* Hero Image */}
        {heroImageUrl && (
          <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={heroImageUrl}
              alt={destination.name}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Destination Details */}
        {destination.details && (
          <div className="prose prose-gray max-w-none mb-20">
            <BlockContent value={destination.details} />
          </div>
        )}

        {/* Related Guides and Posts */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 space-y-12">
          {relatedGuides.length > 0 && (
            <Guides guides={relatedGuides} title="Guides" />
          )}
          {relatedPosts.length > 0 && (
            <Posts posts={relatedPosts} title="Related Blogs" />
          )}
        </div>
      </article>
    </PageLayout>
  );
}
