import { Metadata } from "next";

type MetadataHelperProps = {
  title: string;
  description?: string;
  keywords?: string;
  openGraphImageUrl?: string;
  author?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
};

export function generateMetadataHelper({
  title,
  description,
  keywords,
  openGraphImageUrl,
  author,
  noIndex = false,
  canonicalUrl,
}: MetadataHelperProps): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      images: openGraphImageUrl ? [{ url: openGraphImageUrl }] : undefined,
      type: "article",
      authors: author ? [author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraphImageUrl ? [openGraphImageUrl] : undefined,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };

  return metadata;
}
