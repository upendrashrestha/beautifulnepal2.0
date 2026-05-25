import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ========== TYPES ==========

type SanityImageAsset = {
  _ref: string;
  _type: "reference";
};

type SanityImage = {
  _type: "image";
  asset: SanityImageAsset;
  alt?: string;
};

type SanitySeo = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: SanityImage;
};

type Destination = {
  _id: string;
  name: string;
  slug?: { current: string };
  mainImage?: SanityImage;
  seo?: SanitySeo;
};

type OpenRouterChoice = {
  message: { content: string };
};

type OpenRouterResponse = {
  choices: OpenRouterChoice[];
};

type GeneratedSeo = {
  excerpt: string;
  keywords: string[];
};

// ========== ENV VALIDATION ==========

const requiredEnv = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "OPENROUTER_API_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// ========== AI HELPER ==========

async function generateSeoFromDestinationName(
  name: string,
): Promise<GeneratedSeo> {
  const prompt = `
Given the Nepal travel destination name: "${name}"

Generate:
- A short excerpt (max 160 characters) summarising what a travel guide for this place would cover.
- A list of 5-10 relevant SEO keywords (include "${name} Nepal", "things to do in ${name}", etc.)

Return valid JSON only, with the following structure:
{
  "excerpt": "short excerpt under 160 chars",
  "keywords": ["keyword1", "keyword2", "..."]
}

Do not include any other text or comments outside the JSON.
`;

  const response = await axios.post<OpenRouterResponse>(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO expert for Nepal travel. Always output valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const rawContent = response.data.choices[0].message.content;
  let parsed: GeneratedSeo;

  try {
    parsed = JSON.parse(rawContent) as GeneratedSeo;
  } catch {
    throw new Error(`AI returned invalid JSON for ${name}\nRaw: ${rawContent}`);
  }

  if (!parsed.excerpt || !Array.isArray(parsed.keywords)) {
    throw new Error("AI response missing excerpt or keywords");
  }

  if (parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

// ========== BACKFILL MAIN ==========

async function backfillDestinationsSeo() {
  console.log("Fetching destinations without SEO...");

  const query = `*[_type == "destination" && !defined(seo)] {
    _id,
    name,
    slug,
    mainImage
  }`;

  const destinations = await sanityClient.fetch<Destination[]>(query);
  console.log(`Found ${destinations.length} destinations to update.`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");

  for (const dest of destinations) {
    console.log(`\nProcessing: ${dest.name}`);

    try {
      const { excerpt, keywords } = await generateSeoFromDestinationName(
        dest.name,
      );

      const slug =
        dest.slug?.current || dest.name.toLowerCase().replace(/\s+/g, "-");
      const canonicalUrl = `${siteUrl}/destinations/${slug}`;

      const seo: SanitySeo = {
        metaTitle: dest.name.slice(0, 60),
        metaDescription: excerpt,
        keywords,
        canonicalUrl,
        noIndex: false,
      };

      if (dest.mainImage?.asset?._ref) {
        seo.ogImage = {
          _type: "image",
          asset: dest.mainImage.asset,
          alt: dest.mainImage.alt ?? dest.name,
        };
      }

      await sanityClient.patch(dest._id).set({ seo }).commit();

      console.log(`✅ Updated SEO for ${dest.name}`);
      console.log(`   Excerpt: ${excerpt}`);
      console.log(`   Keywords: ${keywords.join(", ")}`);
    } catch (err) {
      console.error(`❌ Failed to update ${dest.name}:`, err);
    }

    // Rate limit delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n🎉 Backfill complete.");
}

backfillDestinationsSeo().catch(console.error);
