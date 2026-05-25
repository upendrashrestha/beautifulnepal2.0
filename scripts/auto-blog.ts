import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ==================== TYPES ====================

type NewsArticle = {
  title: string;
  description?: string;
  url?: string;
};

type TrendingTopic = {
  title: string;
  source: string;
};

type OpenRouterChoice = {
  message: {
    content: string;
  };
};

type OpenRouterResponse = {
  choices: OpenRouterChoice[];
};

type PexelsPhoto = {
  src: {
    large: string;
  };
};

type PexelsResponse = {
  photos: PexelsPhoto[];
};

type PortableTextSpan = {
  _type: "span";
  text: string;
};

type PortableTextBlock = {
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: PortableTextSpan[];
};

type ArticleWithSeo = {
  article: string;
  excerpt: string;
  keywords: string[];
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

type SanityPost = {
  _type: "post";
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  excerpt: string;
  publishedAt: string;
  body: PortableTextBlock[];
  featured: boolean;
  aiGenerated: boolean;
  topicSource: string;
  status: "draft" | "published";
  seo: SanitySeo;
  mainImage?: SanityImage;
  author?: {
    _type: "reference";
    _ref: string;
  };
};

// ==================== ENV VALIDATION ====================

const requiredEnv = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "OPENROUTER_API_KEY",
  "PEXELS_API_KEY",
  "NEWS_API_KEY",
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

function stripQuotes(text: string): string {
  return text.replace(/^["']|["']$/g, "").trim();
}

function createSlug(title: string): string {
  return title
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

// ==================== API CALLS ====================

async function getTrendingTopic(): Promise<TrendingTopic> {
  try {
    const fromDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const newsResponse = await axios.get<{ articles: NewsArticle[] }>(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: "Nepal tourism OR Nepal trekking OR Pokhara OR Everest OR Kathmandu",
          language: "en",
          sortBy: "publishedAt",
          pageSize: 10,
          from: fromDate,
          apiKey: process.env.NEWS_API_KEY,
        },
      },
    );

    const articles = newsResponse.data.articles;
    if (!articles.length) {
      return {
        title: "Best Hidden Places to Visit in Nepal",
        source: "fallback",
      };
    }

    const titles = articles.map((a) => a.title).join("\n");

    const aiResponse = await axios.post<OpenRouterResponse>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an SEO editor for Nepal tourism.",
          },
          {
            role: "user",
            content: `
Recent Nepal travel/news topics:

${titles}

Pick ONE SEO-friendly travel blog topic for Nepal that people would search.

Return the title only, with no surrounding quotes.
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      },
    );

    const rawTopic = aiResponse.data.choices[0]?.message?.content?.trim();
    const topic = rawTopic ? stripQuotes(rawTopic) : null;

    return {
      title: topic || "Best Hidden Places to Visit in Nepal",
      source: "news",
    };
  } catch (error) {
    console.error("Topic generation failed", error);
    return {
      title: "Best Hidden Places to Visit in Nepal",
      source: "fallback",
    };
  }
}

async function generateArticleWithSeo(title: string): Promise<ArticleWithSeo> {
  const prompt = `
Write a detailed SEO travel blog.

Title: ${title}

Requirements:
- 1200+ words
- engaging intro
- headings
- travel tips
- FAQs
- SEO optimized
- factual information
- markdown format

Also provide:
- A short excerpt (max 160 characters) summarising the article.
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
            "You are an expert Nepal travel writer. Always output valid JSON.",
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

  if (!parsed.article || !parsed.excerpt || !Array.isArray(parsed.keywords)) {
    throw new Error("AI response missing required fields");
  }

  if (parsed.excerpt.length > 160) {
    parsed.excerpt = parsed.excerpt.slice(0, 157) + "...";
  }

  return parsed;
}

async function fetchImage(query: string): Promise<PexelsPhoto | null> {
  try {
    const response = await axios.get<PexelsResponse>(
      "https://api.pexels.com/v1/search",
      {
        headers: { Authorization: process.env.PEXELS_API_KEY! },
        params: { query: `${query} Nepal`, per_page: 1 },
      },
    );
    return response.data.photos[0] ?? null;
  } catch (error) {
    console.error("Image fetch failed", error);
    return null;
  }
}

async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    const image = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });
    const asset = await sanityClient.assets.upload(
      "image",
      Buffer.from(image.data),
      { filename: "auto-blog.jpg" },
    );
    return asset._id;
  } catch (error) {
    console.error("Image upload failed", error);
    return null;
  }
}

async function getAuthor(): Promise<{ _id: string; name: string }> {
  // 1. Try to fetch author named "Beautiful Nepal"
  const beautifulNepal = await sanityClient.fetch<{
    _id: string;
    name: string;
  } | null>(`
    *[_type == "author" && name == "Beautiful Nepal"][0]{
      _id,
      name
    }
  `);
  if (beautifulNepal) {
    console.log("✅ Using author: Beautiful Nepal");
    return beautifulNepal;
  }

  // 2. Fallback: first available author
  const fallbackAuthor = await sanityClient.fetch<{
    _id: string;
    name: string;
  } | null>(`
    *[_type == "author"][0]{
      _id,
      name
    }
  `);
  if (!fallbackAuthor) {
    throw new Error(
      "No author found. Please create an author document (e.g., 'Beautiful Nepal') in Sanity.",
    );
  }
  console.warn(
    `⚠️ 'Beautiful Nepal' not found. Using fallback author: ${fallbackAuthor.name}`,
  );
  return fallbackAuthor;
}

// ==================== MAIN ====================
async function createPost(): Promise<void> {
  console.log("Finding trending Nepal topic...");
  const topic = await getTrendingTopic();
  console.log("Topic:", topic.title);

  console.log("Generating article and SEO data...");
  const { article, excerpt, keywords } = await generateArticleWithSeo(
    topic.title,
  );

  console.log("Fetching image...");
  const image = await fetchImage(topic.title);
  let imageRef: string | null = null;
  if (image) {
    imageRef = await uploadImage(image.src.large);
  }

  const slug = createSlug(topic.title);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/posts/${slug}`;

  // Get the default author
  const author = await getAuthor();

  // Build SEO object
  const seo: SanitySeo = {
    metaTitle: topic.title.slice(0, 60),
    metaDescription: excerpt,
    keywords,
    canonicalUrl,
    noIndex: false,
  };

  if (imageRef) {
    seo.ogImage = {
      _type: "image",
      asset: { _type: "reference", _ref: imageRef },
      alt: topic.title,
    };
  }

  // Build the post document
  const post: SanityPost = {
    _type: "post",
    title: topic.title,
    slug: { _type: "slug", current: slug },
    author: { _type: "reference", _ref: author._id }, // 👈 Add author reference
    excerpt,
    publishedAt: new Date().toISOString(),
    body: markdownToPortableText(article),
    featured: false,
    aiGenerated: true,
    topicSource: topic.source,
    status: "draft",
    seo,
  };

  if (imageRef) {
    post.mainImage = {
      _type: "image",
      asset: { _type: "reference", _ref: imageRef },
      alt: topic.title,
    };
  }

  await sanityClient.create(post);
  console.log(`✅ Post created: ${topic.title}`);
  console.log(`   Author: ${author.name}`);
  console.log(`   Excerpt: ${excerpt}`);
  console.log(`   Keywords: ${keywords.join(", ")}`);
}

createPost().catch(console.error);
