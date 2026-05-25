import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ========== TYPES ==========

type PortableTextSpan = {
  _type: "span";
  text: string;
};

type PortableTextBlock = {
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: PortableTextSpan[];
};

type SanityImageAsset = {
  _type: "reference";
  _ref: string;
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
  intro?: string;
  slug?: {
    current: string;
  };
  details?: PortableTextBlock[];
  mainImage?: SanityImage;
  seo?: SanitySeo;
};

type OpenRouterChoice = {
  message: {
    content: string;
  };
};

type OpenRouterResponse = {
  choices: OpenRouterChoice[];
};

type DestinationContentWithSeo = {
  article: string; // markdown content
  excerpt: string; // ≤160 chars
  keywords: string[]; // 5-10 keywords
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

// ========== UTILITIES ==========

function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.map((line) => {
    let style: PortableTextBlock["style"] = "normal";
    let text = line;

    if (line.startsWith("### ")) {
      style = "h3";
      text = line.slice(4);
    } else if (line.startsWith("## ")) {
      style = "h2";
      text = line.slice(3);
    } else if (line.startsWith("# ")) {
      style = "h1";
      text = line.slice(2);
    }

    return {
      _type: "block",
      style,
      children: [{ _type: "span", text }],
    };
  });
}

// ========== SANITY QUERIES ==========

async function fetchDestinations(): Promise<Destination[]> {
  return sanityClient.fetch(`
    *[_type == "destination"]{
      _id,
      name,
      slug,
      intro,
      details,
      mainImage
    }
  `);
}

// ========== AI GENERATION ==========

async function generateDestinationContentWithSeo(
  destination: Destination,
): Promise<DestinationContentWithSeo> {
  const prompt = `
Write a complete SEO travel guide about ${destination.name}, Nepal.

Context: ${destination.intro || ""}

Requirements:
- 1500+ words
- markdown format
- SEO optimized
- factual information only
- engaging introduction
- include local history or significance
- best time to visit
- weather overview
- how to reach
- transportation options
- top attractions
- trekking/adventure activities
- local foods to try
- accommodation recommendations
- estimated travel budget
- travel tips
- safety tips
- FAQs
- strong conclusion

Also provide:
- A short excerpt (max 160 characters) summarising the guide.
- A list of 5-10 relevant SEO keywords (including "${destination.name} Nepal", "Things to do in ${destination.name}", etc.)

Return valid JSON only, with the following structure:
{
  "article": "markdown content here",
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
            "You are an expert Nepal travel writer and SEO strategist. Always output valid JSON.",
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
  let parsed: DestinationContentWithSeo;

  try {
    parsed = JSON.parse(rawContent) as DestinationContentWithSeo;
  } catch {
    throw new Error(
      `AI returned invalid JSON for ${destination.name}\nRaw: ${rawContent}`,
    );
  }

  if (!parsed.article || !parsed.excerpt || !Array.isArray(parsed.keywords)) {
    throw new Error("AI response missing required fields");
  }

  if (parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

// ========== UPDATE DESTINATION ==========

async function updateDestinationWithSeo(
  destinationId: string,
  articleMarkdown: string,
  seoData: Omit<SanitySeo, "ogImage">, // ogImage will reuse mainImage if exists
) {
  const portableText = markdownToPortableText(articleMarkdown);

  // Fetch current destination to get mainImage (if any)
  const current = await sanityClient.fetch<{ mainImage?: SanityImage }>(
    `*[_id == $id][0]{ mainImage }`,
    { id: destinationId },
  );

  const seo: SanitySeo = {
    ...seoData,
  };

  if (current.mainImage?.asset?._ref) {
    seo.ogImage = {
      _type: "image",
      asset: current.mainImage.asset,
      alt: current.mainImage.alt || seoData.metaTitle,
    };
  }

  await sanityClient
    .patch(destinationId)
    .set({
      details: portableText,
      seo: seo,
    })
    .commit();

  console.log(`✅ Updated destination ${destinationId} with content + SEO`);
}

// ========== MAIN ==========

async function generateAllDestinationContent() {
  console.log("📍 Fetching destinations...");
  const destinations = await fetchDestinations();
  console.log(`Found ${destinations.length} destinations`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");

  for (const destination of destinations) {
    try {
      // Skip if already has details and SEO
      if (
        destination.details &&
        destination.details.length > 0 &&
        destination.seo
      ) {
        console.log(
          `⏭ Skipping ${destination.name} (already has content & SEO)`,
        );
        continue;
      }

      console.log(`✍️ Generating content + SEO for ${destination.name}`);
      const { article, excerpt, keywords } =
        await generateDestinationContentWithSeo(destination);

      const slug =
        destination.slug?.current ||
        destination.name.toLowerCase().replace(/\s+/g, "-");
      const canonicalUrl = `${siteUrl}/destinations/${slug}`;

      const seoData = {
        metaTitle: destination.name.slice(0, 60),
        metaDescription: excerpt,
        keywords,
        canonicalUrl,
        noIndex: false,
      };

      await updateDestinationWithSeo(destination._id, article, seoData);

      // Avoid API rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed for ${destination.name}`, error);
    }
  }

  console.log("🎉 Destination generation complete");
}

generateAllDestinationContent().catch(console.error);
