/* =========================================================================
   Copies only the public site into _site/ (without tools/, docs/, README, .git…).
   Used by Cloudflare (build command; see wrangler.jsonc). No npm install needed.
   Also inlines assets/css/style.css and the data/*.js + render.js scripts into each page (faster first paint).
     node tools/build-site.mjs
   The site address (https://pizza-brusenky.com.ua/) is written directly in the HTML, robots.txt and sitemap.xml.
   SITE_URL (optional env variable) is only needed for a copy of the template that still has the placeholder
   https://USERNAME.github.io/bogdana-cafe/ — it replaces it in canonical / link-preview tags, robots.txt, sitemap.xml.
   On Cloudflare (CF_PAGES / WORKERS_CI are set automatically) menu.html becomes /menu (Cloudflare's clean URL).
   ========================================================================= */
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_site');
const SKIP = new Set(['_site', 'tools', 'docs', 'node_modules', 'README.md', '.git', '.github', '.gitignore', '.wrangler', 'wrangler.jsonc', '.DS_Store', 'Thumbs.db']);
const PLACEHOLDER = 'https://USERNAME.github.io/bogdana-cafe/';

rmSync(OUT, { recursive: true, force: true });
for (const name of readdirSync(ROOT)) {
  if (SKIP.has(name)) continue;
  cpSync(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}

let url = (process.env.SITE_URL || '').trim();
if (url) {
  if (!url.endsWith('/')) url += '/';
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  for (const file of walk(OUT).filter((f) => /\.(html|xml|txt|webmanifest)$/.test(f))) {
    let text = readFileSync(file, 'utf8');
    if (!text.includes(PLACEHOLDER)) continue;
    text = text.split(PLACEHOLDER).join(url);
    // Cloudflare serves /menu.html as /menu → use the final address in canonical / sitemap
    if (process.env.CF_PAGES || process.env.WORKERS_CI) text = text.split(`${url}menu.html`).join(`${url}menu`);
    writeFileSync(file, text);
  }
}
// ---- Speed: inline the stylesheet and the small data/render scripts into every page ----
// One request instead of ~9 before the page can be drawn. The source files stay separate (easy to edit,
// and index.html still opens straight from the folder); only the published copy in _site/ is combined.
const read = (rel) => readFileSync(path.join(OUT, rel), 'utf8');
for (const page of readdirSync(OUT).filter((f) => f.endsWith('.html'))) {
  const file = path.join(OUT, page);
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<link rel="stylesheet" href="(assets\/css\/[^"]+\.css)">/g, (m, href) =>
    `<style>${read(href).replace(/url\('\.\.\//g, "url('assets/")}</style>`);
  // only classic scripts without defer/async (main.js stays external and deferred)
  html = html.replace(/<script src="((?:data|assets\/js)\/[^"]+\.js)"><\/script>/g, (m, src) =>
    `<script>/* ${src} */\n${read(src).replace(/<\/script/gi, '<\\/script')}</script>`);
  writeFileSync(file, html);
}
console.log(`Site collected in _site/${url ? ` (URL: ${url})` : ''} — CSS and data scripts inlined`);
