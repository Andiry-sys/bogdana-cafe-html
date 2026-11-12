# Піцерія Брусенки — website (у магазині-кафе «Богдана»)

Plain HTML + CSS + JavaScript. **No build step, no frameworks.** Open `index.html` in a browser, edit in any editor,
upload anywhere (GitHub Pages, Cloudflare Pages, any hosting).

## Project structure

```
bogdana-cafe-html/
│
├── index.html          ← Home page (structure only: sections, classes, where each text goes)
├── menu.html           ← Menu page
├── 404.html            ← "Page not found"
│
├── data/               ← ALL TEXTS — edit here
│   ├── contacts.js     ← name, phone, Viber, Telegram, address, map, hours, socials   (contact + address)
│   ├── home.js         ← texts of the home page (first screen, sourdough story, Instagram block…)
│   ├── menu.js         ← pizzas: names, ingredients, tags, photos; categories; 4 "hits"
│   ├── common.js       ← header, footer, buttons, Viber/Telegram texts, pizza popup, 404
│   ├── analytics.js    ← Google Analytics 4 / Meta Pixel / Clarity IDs
│   └── instagram.js    ← 5 latest Instagram posts — AUTO-GENERATED, don't edit (see «Instagram»)
│
├── assets/             ← everything the pages load
│   ├── css/style.css   ← all styles (colours at the top in :root)
│   ├── js/render.js    ← puts texts from /data into the HTML (normally never edited)
│   ├── js/main.js      ← behaviour: pizza popups, "Відчинено зараз", animations fallback, call tracking
│   ├── fonts/          ← Inter + Playfair Display (Google Fonts, self-hosted)
│   ├── icons/          ← favicon, app icons
│   └── images/
│       ├── hero/       ← big rotating pizza (pizza-480/800/1200.webp)
│       ├── pizza/      ← one photo per pizza (<image>-480.webp, <image>-800.webp)
│       ├── instagram/  ← photos of the 5 latest posts (<post id>-320/640.webp, automatic) + 5 placeholders (1…5)
│       └── og-image.jpg← picture shown when the link is shared
│
├── docs/               ← CREDITS.md, client brief (UA), screenshots, attention heatmaps
├── tools/              ← build-site.mjs (publishing), fetch-instagram.mjs (Instagram), photo converter (optional)
├── .github/workflows/deploy.yml ← refreshes Instagram every 6 h (GitHub Actions)
├── wrangler.jsonc      ← Cloudflare settings (static site from _site/)
├── robots.txt · sitemap.xml · site.webmanifest · .nojekyll
└── README.md
```

**How a page is built:** the browser loads the HTML (structure) → `data/*.js` (texts) → `assets/js/render.js`
fills every element that has a `data-t="…"` attribute with the matching text → `assets/js/main.js` adds behaviour.
Example: `<h2 data-t="home.hits.title"></h2>` shows `SITE.home.hits.title` from `data/home.js`.

## Editing — where is what

| I want to change… | File |
| --- | --- |
| Phone, Viber, Telegram, address, hours, map, social networks | `data/contacts.js` |
| Text that is pre-typed in Viber/Telegram | `data/common.js` → `messengers` |
| Any text on the home page | `data/home.js` |
| Pizzas (add / remove / ingredients / tags), the 4 hits | `data/menu.js` |
| Menu/Contacts labels in the header, footer, buttons | `data/common.js` |
| Colours, sizes, spacing | `assets/css/style.css` |
| Google Analytics / Meta Pixel / Clarity IDs | `data/analytics.js` |
| Page title / description for Google and link previews | `<head>` of `index.html` / `menu.html` |
| Order of sections, layout | `index.html` / `menu.html` |

Rules for texts in `/data`:
- keep the quotes: `title: 'Text',` — an apostrophe inside the text must be the typographic one `’` (e.g. `з’являються`);
- where a comment says *HTML allowed*: `<em>word</em>` = red italic, `<strong>word</strong>` = bold;
- `{readyMinutes}`, `{street}`, `{villageName}`, `{fermentationHours}` … are filled in automatically.

**Add a pizza:** copy one `{ … },` block in `data/menu.js`, give it a new `id` and `image`, put photos into
`assets/images/pizza/<image>-480.webp`, `-800.webp` and `-1200.webp` (the big photo in the popup; `npm run photos` in `tools/` makes all three).
`menu.html#<id>` opens that pizza directly.
Drawn placeholder pictures live in `assets/images/placeholders/` and are marked `placeholder: true` in `data/menu.js`;
`robots.txt` keeps them out of Google image search. When the real photo arrives, put it into `pizza/` and delete `placeholder: true`.
Several photos for one item: add `morePhotos: [{ image: 'name-2', alt: '…' }]` — the popup then shows swipeable photos with dots.
Sold by weight / per piece: `unit: 'кг'` or `unit: 'шт'` → «302 ₴ / кг».

## Run locally
Double-click `index.html` (all paths are relative). Or serve the folder: `npx serve .` / `python -m http.server`.

## Publish

The code lives in a GitHub repository, the site is hosted on **Cloudflare** (free, fast in Ukraine, easy custom domain).
GitHub Actions (`.github/workflows/deploy.yml`) refreshes the Instagram block; Cloudflare publishes every commit automatically.

### 1. Put the project on GitHub (once)
Create a repository (e.g. `bogdana-cafe`) and push this folder **with git** — the hidden `.github` folder must be included:
```bash
git init -b main && git add . && git commit -m "site"
git remote add origin https://github.com/<username>/bogdana-cafe.git && git push -u origin main
```

### 2a. Cloudflare (recommended)
Cloudflare now creates static sites as a **Worker with static assets** (free, requests to static files are unlimited);
the settings are in `wrangler.jsonc`.
1. [dash.cloudflare.com](https://dash.cloudflare.com) (free account) → **Workers & Pages** → **Create application** →
   connect GitHub → choose the repository.
2. Project name `bogdana-cafe` · Build command `node tools/build-site.mjs` · Deploy command `npx wrangler deploy`
   (default). **Deploy** → the site is at `https://bogdana-cafe.<your-subdomain>.workers.dev`.
3. Cloudflare publishes after every commit — yours and the Instagram commits made by GitHub Actions.

### Domain: pizza-brusenky.com.ua
1. Cloudflare → **Add a domain** → `pizza-brusenky.com.ua` → plan **Free** → Cloudflare shows 2 nameservers
   (`xxx.ns.cloudflare.com`). In the domain registrar's panel replace the nameservers with these two.
   Cloudflare emails when the domain is **Active** (minutes to 24 h).
2. Worker `bogdana-cafe` → **Settings → Domains & Routes → Add → Custom domain** → `pizza-brusenky.com.ua`,
   then once more for `www.pizza-brusenky.com.ua`. HTTPS certificates are issued automatically.
3. The address is already written in the HTML (canonical / link previews), `robots.txt` and `sitemap.xml`.
   Google: [search.google.com/search-console](https://search.google.com/search-console) → add the domain → submit
   `https://pizza-brusenky.com.ua/sitemap.xml`. Google Business Profile / Instagram bio → put the new address.

`tools/build-site.mjs` copies only the public files into `_site/` (no tools/docs/README).

## Instagram — 5 latest posts, updated automatically
How it works: GitHub Actions runs `tools/fetch-instagram.mjs` every 6 hours. It reads the account's latest posts
from a free [Behold](https://behold.so) JSON feed and shows them as cards: **photo + post text (3 lines, no hashtags)
+ date**; a card opens the exact post. Photos are saved as WebP in `assets/images/instagram/` (named by post id:
a new post downloads one photo, photos of older posts are removed), texts in `data/instagram.js`;
then it commits and republishes the site.
Until it is set up (or if Instagram/Behold is ever down) the site shows the last saved posts or the placeholders.

Setup, once (~10 min):
1. The Instagram account must be **professional** (free): Instagram → Settings → *Account type and tools* →
   *Switch to professional account* (Business or Creator). Personal accounts can't be read by the Instagram API.
2. [behold.so](https://behold.so) → sign up (free) → *Add source* → log in with **@pizza.brusenky** →
   *New feed* → type **JSON** → copy the feed URL (`https://feeds.behold.so/…`).
3. GitHub repo → **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   name `BEHOLD_FEED_URL`, value = the feed URL.
4. **Actions → Update Instagram → Run workflow** — the real posts appear in ~1 minute.

Limits of the free Behold plan: the feed refreshes **once a day**, 1 200 requests/month (our workflow uses ~120,
visitors use none — images are served from the site itself). Faster refresh = a paid Behold plan.
Run by hand: `cd tools && npm install && BEHOLD_FEED_URL=… npm run instagram`.

## Viber & Telegram
Buttons are on the first screen, in each pizza popup (the message includes the pizza name), in the red call block,
in Contacts, in the footer and in the bottom bar on phones. Number / username: `data/contacts.js` → `messengers`
(empty `''` hides that button).
- Telegram: the order text (with the pizza name from a popup) is pre-typed in the chat.
- Viber, personal number (`viberBusiness: false`): the chat with the cafe opens, the customer types the message.
  Viber has no official way to pre-type text for personal numbers.
- Viber Business account (`viberBusiness: true`): official link `viber.me/<number>?text=…` — the text is pre-typed,
  works without saving the number. Requires registering the number as a Viber Business account.

## Analytics (Google Analytics 4, Meta Pixel, Microsoft Clarity)
Put the IDs into **`data/analytics.js`** — one place for all pages; empty `''` = off. Counters load only on the
published site (not from a folder or localhost), so your own tests are not counted.

Google Analytics 4 (free):
1. [analytics.google.com](https://analytics.google.com) → **Start measuring** / **Admin → Create → Property** →
   name «Піцерія Брусенки», time zone Ukraine, currency UAH → business details → platform **Web**.
2. Website URL (the `.pages.dev` address or the domain) → **Create stream** → copy the **Measurement ID** `G-…`.
3. `data/analytics.js` → `ga4: 'G-…'` → commit/push. Check: GA4 → **Reports → Realtime** while you open the site.
4. After the first clicks: **Admin → Events** → mark `call_click` and `messenger_click` as **key events**
   (these are the orders). `view_pizza` shows which pizzas people look at.

`assets/js/main.js` sends automatically:
- `call_click` (GA4) / `Contact` (Pixel) on every tap on the phone number + where it was tapped (`data-track`);
- `messenger_click` (GA4, with `messenger`: viber/telegram) / `Contact` (Pixel) on Viber/Telegram buttons;
- `view_pizza` (GA4) when a pizza popup is opened.

## Photos
Any editor works — just keep names and proportions (pizza 4:3, hero and Instagram square). Or the optional tool:
```bash
cd tools && npm install && npm run photos   # photos go into tools/photos/, see tools/photos/README.txt
```
It crops, resizes, converts to WebP and evens out colours. Shooting tips for the client: `docs/client-brief-uk.md`.

## Notes
- Texts are inserted by JavaScript. Google renders JavaScript and indexes them; title, description and the link
  preview are static in `<head>`. Structured data (JSON-LD) for Google is generated from `/data` as well.
- Copy rules: we say «на живій заквасці, без дріжджів», taste and texture. We do **not** say «дієтичне»,
  «корисніше», «легше перетравлюється», «без глютену».
- Still placeholders: hours, «борошно, вода, сіль і закваска», photos (pizza, hero; Instagram until the feed is set up).
