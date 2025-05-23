import { BnMetadata } from "@/types";
import { Metadata } from "next";
export async function generateMetadataHelper(
  mdata: BnMetadata
): Promise<Metadata> {
  return {
    title: mdata.title,
    description: mdata.description,
    openGraph: {
      title: mdata.title,
      description: mdata.description,
      images: mdata.openGraphImageUrl,
    },
    keywords: mdata.keywords,
    authors: mdata.author ? [{ name: mdata.author }] : undefined,
  };
}
