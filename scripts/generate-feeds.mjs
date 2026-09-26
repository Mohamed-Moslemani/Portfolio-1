// Regenerates public/sitemap.xml and public/rss.xml from src/posts/index.js.
// Runs before every build (npm "prebuild"), so feeds can't drift from posts.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { posts } from "../src/posts/index.js";

const SITE_URL = "https://www.mohamedmoslemani.com"; // keep in sync with src/utils/seo.js
const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
const postUrl = (p) => `${SITE_URL}/writing/${encodeURIComponent(p.slug)}`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
  <url><loc>${SITE_URL}/writing</loc><lastmod>${sorted[0].date}</lastmod></url>
${sorted.map((p) => `  <url><loc>${esc(postUrl(p))}</loc><lastmod>${p.updated || p.date}</lastmod></url>`).join("\n")}
</urlset>
`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>M. Moslemani Blog</title>
    <link>${SITE_URL}/writing</link>
    <description>Essays on physics, philosophy, society, and the way people think.</description>
${sorted
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(postUrl(p))}</link>
      <guid>${esc(postUrl(p))}</guid>
      <pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;

writeFileSync(out("sitemap.xml"), sitemap);
writeFileSync(out("rss.xml"), rss);
console.log(`feeds: ${sorted.length} posts -> public/sitemap.xml, public/rss.xml`);
