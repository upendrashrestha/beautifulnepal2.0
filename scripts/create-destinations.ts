import axios from "axios";
import { createClient } from "next-sanity";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

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

// Comprehensive list of Nepalese destinations
const NEPAL_DESTINATIONS: readonly { name: string; keywords: string }[] = [
  { name: "Kathmandu Valley", keywords: "capital city, cultural heritage, unesco sites" },
  { name: "Pokhara", keywords: "lakes, mountains, adventure sports" },
  { name: "Everest Base Camp", keywords: "trekking, mount everest, himalayas" },
  { name: "Annapurna Circuit", keywords: "trekking, mountain views, thorong la pass" },
  { name: "Chitwan National Park", keywords: "wildlife, jungle safari, rhinos" },
  { name: "Lumbini", keywords: "buddhist pilgrimage, mayadevi temple, meditation" },
  { name: "Bhaktapur Durbar Square", keywords: "medieval city, pottery, nyatapola temple" },
  { name: "Patan Durbar Square", keywords: "arts, architecture, kumbeshwar temple" },
  { name: "Swayambhunath Stupa", keywords: "monkey temple, buddhist shrine, kathmandu views" },
  { name: "Boudhanath Stupa", keywords: "buddhist pilgrimage, mandala, tibetan culture" },
  { name: "Pashupatinath Temple", keywords: "hindu temple, shiva, cremation ghats" },
  { name: "Nagarkot", keywords: "sunrise views, himalayan panorama, hiking" },
  { name: "Dhulikhel", keywords: "mountain views, traditional town, hiking trails" },
  { name: "Bandipur", keywords: "hill station, newari culture, mountain views" },
  { name: "Gorkha", keywords: "historical palace, gorkha soldiers, manakamana temple" },
  { name: "Manakamana Temple", keywords: "cable car, wish fulfilling goddess, hilltop temple" },
  { name: "Mustang", keywords: "forbidden kingdom, lo manthang, tibetan culture" },
  { name: "Jomsom", keywords: "kali gandaki river, apple orchards, marpha" },
  { name: "Muktinath Temple", keywords: "hindu pilgrimage, 108 water spouts, jwala devi" },
  { name: "Ghandruk", keywords: "gurung village, annapurna views, traditional culture" },
  { name: "Ghorepani", keywords: "poon hill trek, sunrise views, rhododendron forest" },
  { name: "Tansen", keywords: "palpa, traditional crafts, srinagar hill" },
  { name: "Ilam", keywords: "tea gardens, kanyam, green hills" },
  { name: "Janakpur", keywords: "janaki temple, ram sita, religious site" },
  { name: "Bardia National Park", keywords: "wildlife safari, tigers, elephants" },
  { name: "Langtang Valley", keywords: "trekking, glaciers, tamang culture" },
  { name: "Helambu", keywords: "short trek, sherpa culture, forest walks" },
  { name: "Rara Lake", keywords: "deepest lake, remote beauty, rara national park" },
  { name: "Shey Phoksundo Lake", keywords: "turquoise lake, dolpo region, remote trek" },
  { name: "Upper Mustang", keywords: "rain shadow, caves, tiji festival" },
  { name: "Kanchenjunga Base Camp", keywords: "third highest peak, remote trek, biodiversity" },
  { name: "Makalu Base Camp", keywords: "isolated trek, makalu barun, wilderness" },
  { name: "Manaslu Circuit", keywords: "restricted area, larkya la pass, buddhist culture" },
  { name: "Dolpo", keywords: "crystal mountain, shey gompa, tibetan heritage" },
  { name: "Khaptad National Park", keywords: "meditation, diverse flora, khaptad baba" },
  { name: "Dhorpatan Hunting Reserve", keywords: "hunting, wildlife, remote valleys" },
  { name: "Kalinchowk Bhagwati Temple", keywords: "cable car, mountain views, religious site" },
  { name: "Kushma", keywords: "bungee jumping, swing, george river" },
  { name: "Upper Mustang Trek", keywords: "desert landscape, ancient kingdom, buddhist culture" },
  { name: "Panch Pokhari", keywords: "five lakes, religious site, trekking destination" },
];

// Cache for existing destinations
let existingDestinationsCache: Set<string> | null = null;
let existingSlugsCache: Set<string> | null = null;

interface Destination {
  name: string;
  keywords: string;
}

interface ExistingDestination {
  name: string;
  slug: string;
}

interface BlockContentChild {
  _type: "span";
  text: string;
  marks?: string[];
}

interface BlockContentBlock {
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
  children: BlockContentChild[];
  markDefs?: {
    _key: string;
    _type: string;
    href: string;
  }[];
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface PexelsPhoto {
  src: {
    large: string;
    medium: string;
  };
  photographer: string;
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

interface GeneratedContent {
  intro: string;
  details: string;
}

interface CreateDestinationResult {
  success: boolean;
  skipped: boolean;
  name: string;
  error?: unknown;
}

interface CreateOptions {
  forceUpdate?: boolean;
  batchSize?: number;
}

interface SanityImageAsset {
  _id: string;
}

async function loadExistingDestinations(): Promise<{ names: Set<string>; slugs: Set<string> }> {
  if (existingDestinationsCache && existingSlugsCache) {
    return { names: existingDestinationsCache, slugs: existingSlugsCache };
  }
  
  console.log("📚 Loading existing destinations from Sanity...");
  
  const query = `*[_type == "destination"] {
    name,
    "slug": slug.current
  }`;
  
  const existing: ExistingDestination[] = await sanityClient.fetch(query);
  
  existingDestinationsCache = new Set(existing.map((d: ExistingDestination) => d.name.toLowerCase().trim()));
  existingSlugsCache = new Set(existing.map((d: ExistingDestination) => d.slug));
  
  console.log(`✅ Found ${existingDestinationsCache.size} existing destinations`);
  
  return { names: existingDestinationsCache, slugs: existingSlugsCache };
}

async function checkExistingDestination(name: string): Promise<boolean> {
  const { names } = await loadExistingDestinations();
  return names.has(name.toLowerCase().trim());
}

async function checkExistingSlug(slug: string): Promise<boolean> {
  const { slugs } = await loadExistingDestinations();
  return slugs.has(slug);
}

function generateUniqueSlug(baseSlug: string): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugsCache?.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

function stripQuotes(text: string): string {
  return text.replace(/^["']|["']$/g, "").trim();
}

async function generateDestinationContent(destination: Destination): Promise<GeneratedContent> {
  console.log(`📝 Generating content for ${destination.name}...`);
  
  const response = await axios.post<OpenRouterResponse>(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert Nepal travel writer specializing in SEO-friendly destination guides. 
          Write comprehensive, factual, and engaging content. Use markdown formatting.`,
        },
        {
          role: "user",
          content: `
Write a detailed SEO-optimized travel guide for ${destination.name} in Nepal.

Keywords: ${destination.keywords}

Structure the content with these sections:
1. Brief overview/introduction (2-3 sentences for the intro field)
2. Main content with markdown headings:
   - Overview & Highlights
   - Best Time to Visit
   - How to Get There
   - Top Attractions & Activities
   - Where to Stay
   - Local Cuisine
   - Travel Tips
   - Nearby Destinations

Requirements:
- 1500+ words
- SEO optimized with natural keyword placement
- Include specific facts, distances, altitudes, prices where relevant
- Engaging and descriptive language
- Practical travel advice
- Use proper markdown headings (##, ###)
- Create 2-3 sentences for intro (separate from main content)
- End with "Experience the magic of ${destination.name} on your next Nepal adventure."

Format the response as JSON:
{
  "intro": "2-3 sentence engaging introduction",
  "details": "full markdown content with all sections"
}
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

  const content = response.data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("No content generated from AI");
  }
  
  // Parse JSON response
  let parsed: GeneratedContent;
  try {
    parsed = JSON.parse(content) as GeneratedContent;
  } catch {
    const introMatch = content.match(/"intro":\s*"([^"]+)"/);
    
    let detailsText = "";
    const detailsStartMatch = content.match(/"details":\s*"/);
    if (detailsStartMatch && detailsStartMatch.index !== undefined) {
      const startIndex = detailsStartMatch.index + detailsStartMatch[0].length;
      let endIndex = startIndex;
      let escaped = false;
      
      for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        if (char === '\\' && !escaped) {
          escaped = true;
          continue;
        }
        if (char === '"' && !escaped) {
          endIndex = i;
          break;
        }
        escaped = false;
      }
      
      if (endIndex > startIndex) {
        detailsText = content.substring(startIndex, endIndex);
        detailsText = detailsText.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
    }
    
    parsed = {
      intro: introMatch ? introMatch[1] : `Discover the enchanting beauty of ${destination.name}, a hidden gem in Nepal.`,
      details: detailsText || content,
    };
  }
  
  return {
    intro: stripQuotes(parsed.intro),
    details: stripQuotes(parsed.details),
  };
}

function markdownToBlockContent(markdown: string): BlockContentBlock[] {
  const blocks: BlockContentBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (!line) {
      i++;
      continue;
    }
    
    // Handle headings
    if (line.startsWith("# ")) {
      blocks.push({
        _type: "block",
        style: "h1",
        children: [{ _type: "span", text: line.replace(/^# /, "") }],
      });
      i++;
      continue;
    }
    
    if (line.startsWith("## ")) {
      blocks.push({
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: line.replace(/^## /, "") }],
      });
      i++;
      continue;
    }
    
    if (line.startsWith("### ")) {
      blocks.push({
        _type: "block",
        style: "h3",
        children: [{ _type: "span", text: line.replace(/^### /, "") }],
      });
      i++;
      continue;
    }
    
    if (line.startsWith("#### ")) {
      blocks.push({
        _type: "block",
        style: "h4",
        children: [{ _type: "span", text: line.replace(/^#### /, "") }],
      });
      i++;
      continue;
    }
    
    // Handle lists
    if (line.startsWith("- ") || line.startsWith("* ") || line.match(/^\d+\./)) {
      const listItems: BlockContentBlock[] = [];
     // const isOrdered = line.match(/^\d+\./);
      
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* ") || lines[i].trim().match(/^\d+\./))) {
        const listLine = lines[i].trim();
        let itemText = listLine.replace(/^[-*] |^\d+\. /, "");
        
        // Handle bold text in list items
        const boldMatches = itemText.match(/\*\*(.*?)\*\*/g);
        if (boldMatches) {
          boldMatches.forEach(match => {
            const boldText = match.replace(/\*\*/g, "");
            itemText = itemText.replace(match, boldText);
          });
          listItems.push({
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: `• ${itemText}`, marks: ["strong"] }],
          });
        } else {
          listItems.push({
            _type: "block",
            style: "normal",
            children: [{ _type: "span", text: `• ${itemText}` }],
          });
        }
        i++;
      }
      
      blocks.push(...listItems);
      continue;
    }
    
    // Handle normal paragraphs with formatting
    let text = line;
    let marks: string[] = [];
    
    // Handle bold text
    const boldMatch = text.match(/\*\*(.*?)\*\*/);
    if (boldMatch) {
      marks = ["strong"];
      text = text.replace(/\*\*/g, "");
    }
    
    // Handle inline code
    const codeMatch = text.match(/`(.*?)`/);
    if (codeMatch) {
      text = text.replace(/`/g, "");
    }
    
    blocks.push({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text, marks: marks.length > 0 ? marks : undefined }],
    });
    
    i++;
  }
  
  return blocks;
}

async function fetchDestinationImage(destinationName: string): Promise<PexelsPhoto | null> {
  try {
    const response = await axios.get<PexelsResponse>("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
      params: {
        query: `${destinationName} Nepal travel`,
        per_page: 3,
        orientation: "landscape",
      },
    });

    return response.data.photos[0] || null;
  } catch (error) {
    console.error(`Image fetch failed for ${destinationName}:`, error);
    return null;
  }
}

async function uploadImage(imageUrl: string, destinationName: string): Promise<string | null> {
  try {
    const image = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });

    const asset = await sanityClient.assets.upload(
      "image",
      Buffer.from(image.data),
      {
        filename: `${destinationName.toLowerCase().replace(/\s+/g, "-")}-hero.jpg`,
      },
    ) as SanityImageAsset;

    return asset._id;
  } catch (error) {
    console.error(`Image upload failed for ${destinationName}:`, error);
    return null;
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createDestination(destination: Destination, options: { forceUpdate?: boolean } = {}): Promise<CreateDestinationResult> {
  // Check if already exists
  const exists = await checkExistingDestination(destination.name);
  
  if (exists && !options.forceUpdate) {
    console.log(`⚠️  ${destination.name} already exists. Skipping...`);
    return { success: false, skipped: true, name: destination.name };
  }
  
  if (exists && options.forceUpdate) {
    console.log(`🔄 Force updating ${destination.name}...`);
  }
  
  try {
    // Generate content
    const { intro, details } = await generateDestinationContent(destination);
    
    // Fetch and upload image
    console.log(`📸 Fetching image for ${destination.name}...`);
    const pexelsPhoto = await fetchDestinationImage(destination.name);
    let imageRef: string | null = null;
    
    if (pexelsPhoto) {
      imageRef = await uploadImage(pexelsPhoto.src.large, destination.name);
    }
    
    // Create slug and ensure uniqueness
    let slug = createSlug(destination.name);
    const slugExists = await checkExistingSlug(slug);
    if (slugExists) {
      slug = generateUniqueSlug(slug);
      console.log(`📌 Using unique slug: ${slug}`);
    }
    
    // Convert markdown to block content format
    const blockContentDetails = markdownToBlockContent(details);
    
    // Create destination object for Sanity
    const destinationDoc = {
      _type: "destination",
      name: destination.name,
      slug: {
        _type: "slug",
        current: slug,
      },
      intro: intro,
      details: blockContentDetails,
      publishedAt: new Date().toISOString(),
      featured: false,
      affiliateLinks: [], // Empty array for now, can be populated later
      ...(imageRef && {
        heroImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageRef,
          },
          alt: `${destination.name}, Nepal - Travel Guide and Tourism Information`,
        },
      }),
    };
    
    // Create or replace in Sanity
    if (exists && options.forceUpdate) {
      // First find the existing document
      const query = `*[_type == "destination" && name == $name][0]`;
      const existingDoc = await sanityClient.fetch(query, { name: destination.name });
      
      if (existingDoc) {
        await sanityClient.patch(existingDoc._id).set(destinationDoc).commit();
        console.log(`✅ Successfully updated: ${destination.name}`);
      }
    } else {
      await sanityClient.create(destinationDoc);
      console.log(`✅ Successfully created: ${destination.name}`);
    }
    
    // Update cache
    existingDestinationsCache?.add(destination.name.toLowerCase().trim());
    existingSlugsCache?.add(slug);
    
    // Rate limiting to avoid API throttling
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, skipped: false, name: destination.name };
    
  } catch (error) {
    console.error(`❌ Failed to create ${destination.name}:`, error);
    return { success: false, skipped: false, name: destination.name, error };
  }
}

async function createSpecificDestinations(names: string[]): Promise<void> {
  console.log(`🎯 Creating specific destinations: ${names.join(", ")}\n`);
  
  await loadExistingDestinations();
  
  const destinationsToCreate = NEPAL_DESTINATIONS.filter(d => 
    names.some(name => d.name.toLowerCase().includes(name.toLowerCase()))
  );
  
  for (const destination of destinationsToCreate) {
    await createDestination(destination);
  }
}

async function createAllDestinations(options: CreateOptions = {}): Promise<void> {
  const batchSize = options.batchSize || 5;
  const forceUpdate = options.forceUpdate || false;
  
  console.log(`🚀 Starting auto-destination creation for ${NEPAL_DESTINATIONS.length} destinations...`);
  console.log(`📦 Batch size: ${batchSize}`);
  console.log(`🔄 Force update: ${forceUpdate}\n`);
  
  // Load existing destinations once at the start
  await loadExistingDestinations();
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  const failedDestinations: string[] = [];
  
  // Process in batches
  for (let i = 0; i < NEPAL_DESTINATIONS.length; i += batchSize) {
    const batch = NEPAL_DESTINATIONS.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(NEPAL_DESTINATIONS.length / batchSize)}`);
    
    const batchPromises = batch.map(destination => createDestination(destination, { forceUpdate }));
    const results = await Promise.all(batchPromises);
    
    for (const result of results) {
      if (result.success) successCount++;
      else if (result.skipped) skipCount++;
      else {
        failCount++;
        failedDestinations.push(result.name);
      }
    }
    
    // Progress report
    console.log(`\n📊 Progress: ${Math.min(i + batchSize, NEPAL_DESTINATIONS.length)}/${NEPAL_DESTINATIONS.length} destinations processed`);
    console.log(`   ✅ Success: ${successCount} | ⚠️  Skipped: ${skipCount} | ❌ Failed: ${failCount}\n`);
    
    // Add delay between batches
    if (i + batchSize < NEPAL_DESTINATIONS.length) {
      console.log("⏳ Waiting 5 seconds before next batch...\n");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log("\n🎉 Auto-destination creation completed!");
  console.log(`📊 Final Statistics:`);
  console.log(`   ✅ Successfully created/updated: ${successCount}`);
  console.log(`   ⚠️  Skipped (already exist): ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  
  if (failedDestinations.length > 0) {
    console.log(`\n❌ Failed destinations:`);
    failedDestinations.forEach(name => console.log(`   - ${name}`));
    console.log(`\n💡 To retry failed destinations, run:`);
    console.log(`   npm run create-destinations specific ${failedDestinations.join(" ")}`);
  }
}

// Run the script based on command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === "specific") {
  const names = args.slice(1);
  if (names.length === 0) {
    console.error("Please provide destination names. Example: npm run create-destinations specific Pokhara Everest");
    process.exit(1);
  }
  createSpecificDestinations(names).catch(console.error);
} else if (command === "update") {
  createAllDestinations({ forceUpdate: true, batchSize: 3 }).catch(console.error);
} else {
  // Default: create only missing destinations
  createAllDestinations({ forceUpdate: false, batchSize: 5 }).catch(console.error);
}

export { createDestination, createAllDestinations, createSpecificDestinations, NEPAL_DESTINATIONS };