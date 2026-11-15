# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static website of «Піцерія Брусенки» (pizza on sourdough, pickup only, inside the shop-cafe «Богдана»),
live at https://pizza-brusenky.com.ua/. Plain HTML + CSS + vanilla JS — no framework, no bundler, no tests, no linter.
The owner talks in Ukrainian; all visible site texts are Ukrainian. Commit messages are in English and describe the
change in plain, user-facing terms (see `git log`).

## Commands

```bash
python -m http.server            # or: npx serve .   — preview locally (index.html also opens straight from the folder)
node tools/build-site.mjs        # build the published copy into _site/ (what Cloudflare runs; no npm install needed)
cd tools && npm install          # once — only for the two helper scripts below (they need sharp)
cd tools && npm run photos       # tools/photos/*.jpg → assets/images/{pizza,hero,instagram}/*.webp
cd tools && BEHOLD_FEED_URL=… npm run instagram   # refresh the Instagram block by hand
```

There is no test suite: verify changes by opening the pages in a browser (home, menu, a pizza popup via
`menu.html#<id>`, phone width) and by running `node tools/build-site.mjs` and checking `_site/`.

## Architecture

**Texts live in `data/*.js`, structure in the HTML, and `assets/js/render.js` joins them at runtime.**
Each `data/*.js` file assigns a branch of a global `window.SITE` object (`SITE.contacts`, `SITE.home`, `SITE.menu`,
`SITE.common`, `SITE.analytics`, `SITE.instagram`). The HTML pages contain empty elements with attributes such as
`data-t="home.hits.title"`, `data-html=…` (allows `<em>`/`<strong>`), `data-list="path" data-tpl="templateId"`
(repeats a `<template>`; inside it `data-f="field"` etc.) and `data-pizzas="featured"`. The full attribute list and
the `{placeholder}` variables (`{readyMinutes}`, `{street}`, `{priceMin}`…) are documented at the top of `render.js`.
To change a text, edit `data/`; to change layout, edit the HTML; `render.js` rarely needs touching.

Script order matters and is the same in `index.html` and `menu.html`: `data/*.js` → `render.js` (classic, blocking)
→ `main.js` (`defer`, behaviour: open/closed badge from hours, pizza `<dialog>` popups with swipe/arrows and
`#id` deep links, category chips, analytics events `call_click` / `messenger_click` / `view_pizza`, Viber/Telegram
pre-typed order text). The site must still work without `main.js`.

**SEO data is generated, not hand-written:** `render.js` builds JSON-LD (Restaurant/Menu with Offer prices, FAQPage)
from the same `data/` files. Only `<title>`, description, canonical and Open Graph tags are static in each page's
`<head>`. The domain is hard-coded in the HTML `<head>`, `robots.txt` and `sitemap.xml`.

**Build/publish:** `tools/build-site.mjs` copies public files to `_site/` (skips tools/, docs/, README, .github…) and
inlines `style.css` plus every non-deferred `data/`/`assets/js/` script into each page for speed. Source files stay
separate — never inline by hand. Cloudflare (Worker with static assets, `wrangler.jsonc`) builds and deploys every
commit; `/menu.html` is served as `/menu`. `.github/workflows/deploy.yml` only refreshes Instagram every 6 h via
`tools/fetch-instagram.mjs` (Behold JSON feed, repo variable `BEHOLD_FEED_URL`) and commits the result —
`data/instagram.js` and `assets/images/instagram/` are auto-generated, don't edit them.

## Menu and photos

- Items are in `data/menu.js` → `SITE.menu.pizzas`; `category: 'pizza' | 'pastry'`. The header comment of that
  file documents every field (`price`, `unit: 'кг'|'шт'`, `dough: false`, `tags`, `placeholder`, `morePhotos`).
  `featured` lists the 4 items on the home page.
- Each photo `image: 'x'` needs `assets/images/pizza/x-480.webp`, `x-800.webp` and `x-1200.webp` (4:3; the
  1200 one is the big popup photo, with a fallback to 800). Extra popup photos: `morePhotos: [{ image: 'x-2', alt }]`.
- Items still without a real photo use drawn pictures from `assets/images/placeholders/` and carry
  `placeholder: true`; they are excluded from Google data and blocked in `robots.txt`. When a real photo arrives:
  put the files into `assets/images/pizza/` and delete `placeholder: true`.
- `tools/process-photos.mjs` takes `tools/photos/pizza-<image>.jpg` (also `hero.jpg`, `instagram-N.jpg`), crops
  smartly to the slot ratio, applies one "house look" (`LOOK`: normalise, warmth, saturation) and writes WebP in
  all sizes. Keeping all menu photos in one consistent style is an ongoing goal.

## Text rules

- In `data/` strings keep single quotes; an apostrophe inside Ukrainian text must be the typographic `’`
  (`з’являються`), never `'`.
- Copy claims: say «на живій заквасці, без дріжджів», taste and texture. Never claim «дієтичне», «корисніше»,
  «легше перетравлюється», «без глютену».
