import fs from "fs";
import path from "path";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://beautifulnepal.com";

/**
 * Replace these with real DB/CMS queries later
 */
const pages = [
  "/",
  "/blog",
  "/about",
  "/contact",
];

function createUrlset(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("")}
</urlset>`;
}

function createSitemapIndex(files: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (file) => `
  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
  </sitemap>`
  )
  .join("")}
</sitemapindex>`;
}

function writeFile(fileName: string, content: string) {
  const filePath = path.join(process.cwd(), "public", fileName);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Generated: ${fileName}`);
}

function main() {
  // Pages sitemap
  const pagesXml = createUrlset(pages);
  writeFile("sitemap-pages.xml", pagesXml);

  // Content sitemap (placeholder for blog posts etc.)
  const contentXml = createUrlset(["/blog/post-1", "/blog/post-2"]);
  writeFile("sitemap-content.xml", contentXml);

  // Events sitemap
  const eventsXml = createUrlset(["/events/nepal-festival"]);
  writeFile("sitemap-events.xml", eventsXml);

  // Images sitemap (simple version)
  const imagesXml = createUrlset(["/images/mountain.jpg"]);
  writeFile("sitemap-images.xml", imagesXml);

  // Master sitemap index
  const indexXml = createSitemapIndex([
    "sitemap-pages.xml",
    "sitemap-content.xml",
    "sitemap-events.xml",
    "sitemap-images.xml",
  ]);

  writeFile("sitemap.xml", indexXml);
}

main();