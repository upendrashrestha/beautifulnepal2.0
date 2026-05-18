import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

type NewsArticle = {
  title: string;
  description?: string;
  url?: string;
};

type TrendingTopic = {
  title: string;
  source: string;
};

type OpenRouterResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

type PexelsPhoto = {
  src: {
    large: string;
  };
};

type PortableTextBlock = {
  _type: "block";
  style: string;
  children: {
    _type: "span";
    text: string;
  }[];
};

const requiredEnv = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "OPENROUTER_API_KEY",
  "PEXELS_API_KEY",
  "NEWS_API_KEY",
] as const;

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Strip surrounding double or single quotes the AI may wrap around values
function stripQuotes(text: string): string {
  return text.replace(/^["']|["']$/g, "").trim();
}

async function getTrendingTopic(): Promise<TrendingTopic> {
  try {
    const fromDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const response = await axios.get<{
      articles: NewsArticle[];
    }>("https://newsapi.org/v2/everything", {
      params: {
        q: `
          Nepal tourism OR Nepal trekking
          OR Pokhara OR Everest OR Kathmandu
        `,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        from: fromDate,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles;

    if (!articles.length) {
      return {
        title: "Best Hidden Places to Visit in Nepal",
        source: "fallback",
      };
    }

    const titles = articles.map((article) => article.title).join("\n");

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

Pick ONE SEO-friendly travel blog topic
for Nepal that people would search.

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
    // Remove any surrounding quotes the model may have added
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

async function generateArticle(title: string): Promise<string> {
  const response = await axios.post<OpenRouterResponse>(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Nepal travel writer.",
        },
        {
          role: "user",
          content: `
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

  return response.data.choices[0].message.content;
}

function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => {
    let style = "normal";
    let text = line;

    if (line.startsWith("### ")) {
      style = "h3";
      text = line.replace(/^### /, "");
    } else if (line.startsWith("## ")) {
      style = "h2";
      text = line.replace(/^## /, "");
    } else if (line.startsWith("# ")) {
      style = "h1";
      text = line.replace(/^# /, "");
    }

    return {
      _type: "block",
      style,
      children: [
        {
          _type: "span",
          text,
        },
      ],
    };
  });
}

async function fetchImage(query: string): Promise<PexelsPhoto | null> {
  try {
    const response = await axios.get<{
      photos: PexelsPhoto[];
    }>("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
      params: {
        query: `${query} Nepal`,
        per_page: 1,
      },
    });

    return response.data.photos[0] || null;
  } catch (error) {
    console.error("Image fetch failed", error);
    return null;
  }
}

async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    const image = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const asset = await sanityClient.assets.upload(
      "image",
      Buffer.from(image.data),
      {
        filename: "auto-blog.jpg",
      },
    );

    return asset._id;
  } catch (error) {
    console.error("Image upload failed", error);
    return null;
  }
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createPost() {
  console.log("Finding trending Nepal topic...");

  const topic = await getTrendingTopic();

  console.log("Topic:", topic.title);

  const article = await generateArticle(topic.title);

  const image = await fetchImage(topic.title);

  let imageRef: string | null = null;

  if (image) {
    imageRef = await uploadImage(image.src.large);
  }

  const slug = createSlug(topic.title);

  const post = {
    _type: "post",

    title: topic.title,

    slug: {
      _type: "slug",
      current: slug,
    },

    excerpt: topic.title,

    publishedAt: new Date().toISOString(),

    body: markdownToPortableText(article),

    featured: false,

    aiGenerated: true,

    topicSource: topic.source,

    status: "draft",

    ...(imageRef && {
      mainImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageRef,
        },
        alt: topic.title,
      },
    }),
  };

  await sanityClient.create(post);

  console.log(`Post created successfully: ${topic.title}`);
}

createPost().catch(console.error);
