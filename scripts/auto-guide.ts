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
  heroImage?: SanityImage;
};

type Author = {
  _id: string;
  name: string;
};

type OpenRouterChoice = {
  message: { content: string };
};

type OpenRouterResponse = {
  choices: OpenRouterChoice[];
};

type GuideContentWithSeo = {
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

// ========== CONSTANTS ==========

const GUIDE_TEMPLATES = [
  "Complete Travel Guide to {destination}",
  "Best Things to Do in {destination}",
  "Best Time to Visit {destination}",
  "{destination} Budget Travel Guide",
  "First-Time Visitor Guide to {destination}",
  "{destination} Trekking & Adventure Guide",
];

// ========== UTILITIES ==========

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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
      intro,
      heroImage
    }
  `);
}

async function getAuthor(): Promise<Author> {
  // Try to find author named "Beautiful Nepal"
  const author = await sanityClient.fetch<Author | null>(`
    *[_type == "author" && name == "Beautiful Nepal"][0]{
      _id,
      name
    }
  `);

  if (!author) {
    // Fallback: get any author (or throw error)
    const anyAuthor = await sanityClient.fetch<Author | null>(`
      *[_type == "author"][0]{
        _id,
        name
      }
    `);
    if (!anyAuthor) {
      throw new Error(
        "No author found. Please create an author document named 'Beautiful Nepal' or any author."
      );
    }
    console.warn("⚠️ 'Beautiful Nepal' author not found. Using fallback author:", anyAuthor.name);
    return anyAuthor;
  }

  console.log("✅ Using author:", author.name);
  return author;
}

async function guideExists(slug: string): Promise<boolean> {
  const existing = await sanityClient.fetch(
    `*[_type == "guide" && slug.current == $slug][0]{ _id }`,
    { slug },
  );
  return !!existing;
}

// ========== AI GENERATION ==========

async function generateGuideContentWithSeo(
  title: string,
  destination: Destination,
): Promise<GuideContentWithSeo> {
  const prompt = `
Write a detailed Nepal travel guide.

Guide title: ${title}
Destination: ${destination.name}, Nepal
Context: ${destination.intro || ""}

Requirements:
- 1200+ words
- markdown format
- SEO optimized
- engaging intro
- useful travel advice
- factual information
- headings and subheadings
- FAQs
- travel tips
- conclusion

Target keywords: "${destination.name} Nepal", "${title}"

Also provide:
- A short excerpt (max 160 characters) summarising the guide.
- A list of 5-10 relevant SEO keywords.

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
        { role: "user", content: prompt },
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
  let parsed: GuideContentWithSeo;

  try {
    parsed = JSON.parse(rawContent) as GuideContentWithSeo;
  } catch {
    throw new Error(
      `AI returned invalid JSON for ${title}\nRaw: ${rawContent}`,
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

// ========== CREATE GUIDE ==========

async function createGuideWithSeo(
  title: string,
  articleMarkdown: string,
  seoData: Omit<SanitySeo, "ogImage">,
  destination: Destination,
  author: Author,
) {
  const slug = createSlug(title);
  const portableBody = markdownToPortableText(articleMarkdown);

  // Build seo object
  const seo: SanitySeo = {
    ...seoData,
  };

  // Use destination's heroImage as ogImage if available
  if (destination.heroImage?.asset?._ref) {
    seo.ogImage = {
      _type: "image",
      asset: destination.heroImage.asset,
      alt: destination.heroImage.alt || title,
    };
  }

  const doc = {
    _type: "guide",
    title,
    slug: { _type: "slug", current: slug },
    author: { _type: "reference", _ref: author._id },
    destination: { _type: "reference", _ref: destination._id },
    publishedAt: new Date().toISOString(),
    body: portableBody,
    excerpt: seoData.metaDescription, // use the generated excerpt as the root excerpt
    featured: false,
    seo,
    // Main image for listing (same as ogImage)
    ...(seo.ogImage && {
      mainImage: seo.ogImage,
    }),
  };

  await sanityClient.create(doc);
  console.log(`✅ Created guide: ${title}`);
}

// ========== MAIN ==========

async function generateGuides() {
  console.log("Fetching destinations...");
  const destinations = await fetchDestinations();
  const author = await getAuthor();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");

  for (const destination of destinations) {
    for (const template of GUIDE_TEMPLATES) {
      try {
        const title = template.replace("{destination}", destination.name);
        const slug = createSlug(title);
        const exists = await guideExists(slug);

        if (exists) {
          console.log(`⏭ Skipping ${title} (already exists)`);
          continue;
        }

        console.log(`✍️ Generating ${title} + SEO`);
        const { article, excerpt, keywords } =
          await generateGuideContentWithSeo(title, destination);

        const canonicalUrl = `${siteUrl}/guides/${slug}`;
        const seoData = {
          metaTitle: title.slice(0, 60),
          metaDescription: excerpt,
          keywords,
          canonicalUrl,
          noIndex: false,
        };

        await createGuideWithSeo(title, article, seoData, destination, author);

        // Rate limit
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `❌ Failed for ${destination.name} with template ${template}`,
          error,
        );
      }
    }
  }

  console.log("🎉 Guide generation complete");
}

generateGuides().catch(console.error);
