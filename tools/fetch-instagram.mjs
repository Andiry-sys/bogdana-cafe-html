/* =========================================================================
   Instagram → site: the 5 latest posts with their photos, text and date.
   Saves assets/images/instagram/<post id>-320/640.webp + data/instagram.js.
   Run by GitHub Actions (.github/workflows/deploy.yml) every 6 hours; can also be run by hand:
     cd tools && npm install && BEHOLD_FEED_URL=https://feeds.behold.so/XXXX npm run instagram
   Source: a free Behold.so JSON feed (Behold talks to the official Instagram API for us,
   no tokens or secrets to keep). Never fails the build: on any error the old posts stay.
   Photos are named by post id → a new post downloads one photo; photos of posts that
   dropped out of the 5 are deleted (they stay in the git history).
   ========================================================================= */
import { readFile, writeFile, mkdir, readdir, unlink, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const COUNT = 5;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = path.join(ROOT, 'assets/images/instagram');
const DATA = path.join(ROOT, 'data/instagram.js');
const FEED = process.env.BEHOLD_FEED_URL;
const PLACEHOLDER = /^[1-5]-(320|640)\.webp$/; // fallback tiles, always kept

const warn = (msg) => { console.log(`::warning::${msg}`); process.exit(0); };
if (!FEED) warn('BEHOLD_FEED_URL is not set — Instagram posts were not updated.');

// what is on the site now
const dataText = await readFile(DATA, 'utf8');
let current = { checked: '', posts: [] };
try { current = JSON.parse(dataText.match(/SITE\.instagramFeed = (\{.*\});/)[1]); } catch {}

let feed;
try {
  const res = await fetch(FEED);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  feed = await res.json();
} catch (e) { warn(`Instagram feed not loaded (${e.message}) — keeping the current posts.`); }

const posts = (feed.posts || []).slice(0, COUNT);
if (posts.length < COUNT) warn(`Feed has only ${posts.length} posts — keeping the current ones.`);

const clean = (s) => String(s || '').replace(/#[^\s#]+/g, '').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);
const fileId = (p) => String(p.id).replace(/[^\w-]/g, '');

const out = posts.map((p) => ({
  id: fileId(p),
  url: p.permalink,
  alt: cut(clean(p.altText), 160),                        // Instagram's own alt text, if the author added one
  text: cut(clean(p.prunedCaption || p.caption), 220),    // post text without hashtags (shown in 3 lines)
  date: p.timestamp || '',
  video: p.mediaType === 'VIDEO',
}));
const month = new Date().toISOString().slice(0, 7);
const next = { checked: month, posts: out };
if (JSON.stringify(next) === JSON.stringify(current)) { console.log('No new posts.'); process.exit(0); }

// photos: download only the ones we don't have yet (all first — on any error nothing changes)
await mkdir(IMG_DIR, { recursive: true });
const exists = (f) => access(f).then(() => true, () => false);
const fresh = [];
for (const [i, p] of posts.entries()) {
  const id = out[i].id;
  if (await exists(path.join(IMG_DIR, `${id}-640.webp`))) continue;
  const s = p.sizes || {};
  const src = (s.medium || s.large || s.small || {}).mediaUrl || (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl);
  try {
    const r = await fetch(src);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    fresh.push({ id, buf: Buffer.from(await r.arrayBuffer()) });
  } catch (e) { warn(`Photo of post ${id} not loaded (${e.message}) — keeping the current posts.`); }
}
for (const { id, buf } of fresh) {
  for (const w of [320, 640]) {
    await sharp(buf).rotate().resize(w, w, { fit: 'cover', position: 'attention' })
      .webp({ quality: 78 }).toFile(path.join(IMG_DIR, `${id}-${w}.webp`));
  }
}
// remove photos of posts that are no longer among the 5
const keep = new Set(out.flatMap((p) => [`${p.id}-320.webp`, `${p.id}-640.webp`]));
for (const f of await readdir(IMG_DIR)) {
  if (!PLACEHOLDER.test(f) && !keep.has(f)) await unlink(path.join(IMG_DIR, f));
}

await writeFile(DATA, `${dataText.split('SITE.instagramFeed =')[0]}SITE.instagramFeed = ${JSON.stringify(next)};\n`);
console.log(`Saved ${out.length} posts (${fresh.length} new photos).`);
