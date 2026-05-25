import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ==================== TYPES ====================

type OpenRouterChoice = {
  message: {
    content: string;
  };
};

type OpenRouterResponse = {
  choices: OpenRouterChoice[];
};

type ArticleWithSeo = {
  excerpt: string;
  keywords: string[];
};

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

type SanityPost = {
  _id: string;
  _type: "post";
  title: string;
  slug: {
    current: string;
  };
  mainImage?: SanityImage;
  _createdAt: string;
  seo?: SanitySeo;
};

// ==================== ENV VALIDATION ====================

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

// ==================== UTILITIES ====================

async function generateSeoFromTitle(title: string): Promise<ArticleWithSeo> {
  const prompt = `
Given the blog post title: "${title}"

Generate:
- A short excerpt (max 160 characters) summarising what the article would cover.
- A list of 5-10 relevant SEO keywords for this topic.

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
          content: "You are an SEO expert. Always output valid JSON.",
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
  let parsed: ArticleWithSeo;

  try {
    parsed = JSON.parse(rawContent) as ArticleWithSeo;
  } catch {
    throw new Error(
      `AI returned invalid JSON for title: ${title}\nRaw: ${rawContent}`,
    );
  }

  if (!parsed.excerpt || !Array.isArray(parsed.keywords)) {
    throw new Error("AI response missing excerpt or keywords");
  }

  if (parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

// ==================== MAIN BACKFILL ====================

async function backfillSeo(): Promise<void> {
  console.log("Fetching posts without SEO data...");

  const query = `*[_type == "post" && !defined(seo)] {
    _id,
    title,
    slug,
    mainImage,
    _createdAt
  }`;

  const posts = await sanityClient.fetch<SanityPost[]>(query);
  console.log(`Found ${posts.length} posts to update.`);

  for (const post of posts) {
    console.log(`\nProcessing: ${post.title}`);

    try {
      const { excerpt, keywords } = await generateSeoFromTitle(post.title);

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
      const canonicalUrl = `${siteUrl}/posts/${post.slug.current}`;

      const seo: SanitySeo = {
        metaTitle: post.title.slice(0, 60),
        metaDescription: excerpt,
        keywords,
        canonicalUrl,
        noIndex: false,
      };

      // Reuse existing mainImage for ogImage if present
      if (post.mainImage?.asset?._ref) {
        seo.ogImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: post.mainImage.asset._ref,
          },
          alt: post.mainImage.alt ?? post.title,
        };
      }

      await sanityClient.patch(post._id).set({ seo }).commit();

      console.log(`✅ Updated: ${post.title}`);
      console.log(`   Excerpt: ${excerpt}`);
      console.log(`   Keywords: ${keywords.join(", ")}`);
    } catch (err) {
      console.error(`❌ Failed to update ${post.title}:`, err);
    }
  }

  console.log("\nBackfill complete.");
}

backfillSeo().catch(console.error);
