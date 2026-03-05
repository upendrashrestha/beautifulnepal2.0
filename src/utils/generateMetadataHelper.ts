import { BnMetadata } from "../../types";
import { Metadata } from "next";
import { generateKeywords } from "./generateKeywords";
export async function generateMetadataHelper(
  mdata: BnMetadata,
): Promise<Metadata> {
  const keywords = await generateKeywords({
    title: mdata.title,
    categories: mdata.keywords?.split(","),
  });
  return {
    title: mdata.title,
    description: mdata.description,
    openGraph: {
      title: mdata.title,
      description: mdata.description,
      images: mdata.openGraphImageUrl,
    },
    keywords: keywords,
    authors: mdata.author ? [{ name: mdata.author }] : undefined,
  };
}
