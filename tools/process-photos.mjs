#!/usr/bin/env node
/**
 * OPTIONAL photo tool (the website itself needs no build).
 *
 *   cd tools
 *   npm install          (once)
 *   npm run photos
 *
 * Put JPG/PNG/WebP photos into tools/photos/ named after the slot they replace:
 *   hero.jpg                       → assets/images/hero/pizza-480|800|1200.webp   (square, shown in a circle)
 *   pizza-<image>.jpg              → assets/images/pizza/<image>-480|800.webp     (4:3 menu card; <image> = "image" in data/menu.js)
 *   instagram-1.jpg … -6.jpg       → assets/images/instagram/1…6-320|640.webp    (square)
 * The script crops smartly (keeps the food in frame), resizes, converts to WebP and applies one
 * "house look" so photos from different phones match. iPhone HEIC is not supported — use JPG.
 */
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const IN = path.join(here, 'photos');
const IMAGES = path.join(here, '..', 'assets', 'images');

// House look: gentle auto-levels + a touch of warmth and saturation. Set NORMALIZE=false if photos are already edited.
const LOOK = { normalize: true, warmth: 0.03, saturation: 1.06, brightness: 1.02 };

// slot → output folder, file base name, sizes
const slotFor = (name) => {
  if (name === 'hero' || name === 'hero-pizza') return { dir: 'hero', base: 'pizza', widths: [480, 800, 1200], ratio: 1, position: 'centre' };
  const ig = name.match(/^(?:instagram|ig)-(\d)$/);
  if (ig) return { dir: 'instagram', base: ig[1], widths: [320, 640], ratio: 1 };
  return { dir: 'pizza', base: name.replace(/^pizza-/, ''), widths: [480, 800], ratio: 3 / 4 }; // menu cards (4:3)
};

const files = (await readdir(IN).catch(() => [])).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (!files.length) {
  console.log('No photos in tools/photos/. Name them like hero.jpg, pizza-margherita.jpg, instagram-1.jpg');
  process.exit(0);
}

for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '').toLowerCase();
  const p = slotFor(name);
  const outDir = path.join(IMAGES, p.dir);
  await mkdir(outDir, { recursive: true });
  for (const w of p.widths) {
    let img = sharp(path.join(IN, file)).rotate();
    if (LOOK.normalize) img = img.normalise({ lower: 1, upper: 99.5 });
    img = img
      .linear([1 + LOOK.warmth, 1, 1 - LOOK.warmth], [0, 0, 0])
      .modulate({ saturation: LOOK.saturation, brightness: LOOK.brightness })
      .resize(w, Math.round(w * p.ratio), { fit: 'cover', position: p.position ?? sharp.strategy.attention })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 78, effort: 6 });
    await img.toFile(path.join(outDir, `${p.base}-${w}.webp`));
  }
  console.log(`✓ ${file} → assets/images/${p.dir}/${p.base}-${p.widths.join('|')}.webp`);
}
console.log('\nDone. Refresh the page. New pizza? Add it to data/menu.js with the same "image" name.');
