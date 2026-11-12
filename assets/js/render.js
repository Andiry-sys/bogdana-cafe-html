/* =========================================================================
   RENDER — puts the texts from /data into the HTML.
   You normally never edit this file: change texts in /data, structure in the .html files.

   HTML attributes it understands:
     data-t="home.hero.eyebrow"      → text from SITE.home.hero.eyebrow
     data-html="home.hero.lead"      → same, but allows <em>/<strong> from the data file
     data-alt / data-aria="path"     → image alt text / aria-label
     data-tel                        → href="tel:<phone>"          data-phone → visible phone number
     data-maps-route / data-maps-embed / data-instagram → links from data/contacts.js
     data-list="path" data-tpl="id"  → repeats <template id="..."> for every item of the list
       inside a template: data-f="field" (text), data-f-html, data-f-href, data-f-aria, data-f-icon,
       data-index (01, 02 …)
     data-pizzas="featured"          → pizza cards + popups (template #tpl-pizza)
   {curly} placeholders in texts: {readyMinutes} {street} {village} {villageName} {fullAddress} {fullName}
   {fermentationHours} {phoneDisplay} {instagram}
   ========================================================================= */
(function () {
  'use strict';
  var S = window.SITE || {};
  var C = S.contacts || {};
  var A = C.address || {};

  var VARS = {
    readyMinutes: C.readyMinutes,
    street: A.street,
    village: A.village,
    villageName: A.villageName,
    // full pickup address: street, village, district, region (from data/contacts.js)
    fullAddress: [A.street, A.village, A.district, A.region].filter(Boolean).join(', '),
    fullName: C.fullName,
    phoneDisplay: C.phoneDisplay,
    instagram: C.instagram,
    fermentationHours: S.home ? S.home.fermentationHours : '',
    // for texts like the FAQ: "Пн–Пт 10:00–21:00, Сб–Нд 11:00–21:00" and the cheapest / most expensive pizza
    hoursText: (C.hours || []).map(function (h) { return h.label + ' ' + h.opens + '–' + h.closes; }).join(', '),
    priceMin: '', priceMax: '',
  };
  (function () {
    // pizzas only (not pastry) — used in «Скільки коштує піца?»
    var ps = ((S.menu && S.menu.pizzas) || []).filter(function (p) { return p.dough !== false; }).map(function (p) { return p.price; }).filter(Boolean);
    if (ps.length) { VARS.priceMin = Math.min.apply(null, ps); VARS.priceMax = Math.max.apply(null, ps); }
  })();

  /* ---------- helpers ---------- */
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function get(path, obj) {
    return String(path).split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj || S);
  }
  function fill(value) {
    if (value == null) return '';
    return String(value)
      .replace(/\{(\w+)\}/g, function (m, k) { return VARS[k] != null ? VARS[k] : m; })
      // typography: keep "с. Брусенки", "вул. …", "~40 хв" on one line
      .replace(/(^|[\s(])(с\.|вул\.|м\.) /g, '$1$2\u00a0')
      .replace(/(\d) (хв|год)/g, '$1\u00a0$2');
  }
  function nbsp(s) { return String(s).replace(/ /g, ' '); }
  function warn(path) { if (window.console) console.warn('[render] missing text: ' + path); }

  var TEL = 'tel:' + (C.phone || '');
  var HAS_GEO = A.lat != null && A.lng != null && A.lat !== '' && A.lng !== '';
  var MAPS_Q = encodeURIComponent(HAS_GEO ? A.lat + ',' + A.lng : (A.mapsQuery || '')); // exact pin if coordinates are set
  var LINKS = {
    route: C.routeUrl || 'https://www.google.com/maps/dir/?api=1&destination=' + MAPS_Q, // contacts.routeUrl wins
    embed: 'https://www.google.com/maps?q=' + MAPS_Q + '&z=15&output=embed',
    instagram: 'https://www.instagram.com/' + (C.instagram || '') + '/',
  };

  /* ---------- Analytics: load the counters whose IDs are set in data/analytics.js ---------- */
  (function (AN) {
    var live = /^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!live) return; // opened from a folder or localhost → don't count
    function load(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }
    if (AN.googleTag || AN.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
    }
    if (AN.googleTag) { // same as Google's snippet: <script async src="…/gtm.js?id=GTM-…"> + gtag('js')
      load('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(AN.googleTag));
    } else if (AN.ga4) {
      window.gtag('config', AN.ga4);
      load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(AN.ga4));
    }
    if (AN.metaPixel && !window.fbq) {
      var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      window._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      load('https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', AN.metaPixel);
      window.fbq('track', 'PageView');
    }
    if (AN.clarity) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      load('https://www.clarity.ms/tag/' + encodeURIComponent(AN.clarity));
    }
  })(S.analytics || {});

  /* ---------- 0. Instagram: real posts (auto-updated data/instagram.js) replace the placeholder tiles ---------- */
  var IG = S.instagramFeed;
  if (IG && IG.posts && IG.posts.length && S.home && S.home.instagram) S.home.instagram.photos = IG.posts.slice(0, 5);

  /* ---------- Viber / Telegram links (order text pre-typed; main.js adds the pizza name in popups) ---------- */
  var MS = C.messengers || {};
  S.messengerUrl = function (kind, text) {
    var q = text ? encodeURIComponent(text) : '';
    if (kind === 'viber') {
      var num = String(MS.viber || '').replace(/\D/g, '');
      return MS.viberBusiness
        ? 'https://viber.me/' + num + (q ? '?text=' + q : '') // official Business chat link, text pre-typed
        : 'viber://chat?number=%2B' + num;                      // personal account: opens the chat
    }
    return 'https://t.me/' + String(MS.telegram || '').replace(/^@/, '') + (q ? '?text=' + q : '');
  };

  /* ---------- 1. lists (templates) — first, so their content gets texts in step 2 ---------- */
  function fillItem(node, item, index) {
    var isText = typeof item !== 'object';
    $$('[data-f]', node).forEach(function (el) {
      var v = isText ? item : item[el.getAttribute('data-f')];
      if (v == null || v === '') { el.remove(); return; }
      el.textContent = fill(v);
    });
    $$('[data-f-html]', node).forEach(function (el) {
      var key = el.getAttribute('data-f-html');
      el.innerHTML = fill(isText || !key ? item : item[key]);
    });
    $$('[data-f-href]', node).forEach(function (el) { el.href = item[el.getAttribute('data-f-href')]; });
    $$('[data-f-aria]', node).forEach(function (el) {
      var key = el.getAttribute('data-f-aria');
      el.setAttribute('aria-label', fill(isText ? item : key ? item[key] : item.alt));
    });
    $$('[data-f-icon]', node).forEach(function (el) { el.setAttribute('href', '#i-' + item[el.getAttribute('data-f-icon')]); });
    $$('[data-index]', node).forEach(function (el) { el.textContent = (index + 1 < 10 ? '0' : '') + (index + 1); });
    // Instagram cards. item = placeholder alt text (data/home.js, photos 1…5-320/640.webp)
    // or a real post {id, url, alt, text, date, video} from data/instagram.js (photos <id>-320/640.webp)
    var post = isText ? null : item;
    $$('[data-insta-img]', node).forEach(function (img) {
      var base = 'assets/images/instagram/' + (post ? post.id : index + 1);
      img.src = base + '-640.webp';
      img.srcset = base + '-320.webp 320w, ' + base + '-640.webp 640w';
      img.sizes = '(min-width: 640px) 240px, 176px';
      img.alt = post ? (post.alt || '') : fill(item); // real post: the caption below already describes it
      var a = img.closest('a');
      if (post && a) {
        a.href = post.url; // open this exact post
        a.removeAttribute('data-instagram');
        a.removeAttribute('aria-label'); // name = photo + caption + date
        if (post.video) a.classList.add('insta__tile--video');
      }
    });
    $$('[data-insta-text]', node).forEach(function (el) {
      if (post && post.text) el.textContent = post.text; else el.remove();
    });
    $$('[data-insta-date]', node).forEach(function (el) {
      var d = post && post.date ? new Date(post.date) : null;
      if (!d || isNaN(d)) { el.remove(); return; }
      el.dateTime = post.date;
      el.textContent = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }); // «5 листопада»
    });
  }

  function renderList(container) {
    var items = get(container.getAttribute('data-list'));
    var tpl = document.getElementById(container.getAttribute('data-tpl'));
    if (!Array.isArray(items) || !tpl) return warn(container.getAttribute('data-list'));
    items.forEach(function (item, i) {
      if (item && item.closes) item = Object.assign({ time: item.opens + ' – ' + item.closes }, item); // hours
      var frag = tpl.content.cloneNode(true);
      fillItem(frag, item, i);
      // menu page: category chips & sections
      $$('[data-cat-chip]', frag).forEach(function (a) { a.href = '#cat-' + item.id; a.setAttribute('data-cat-link', item.id); });
      $$('[data-cat-count]', frag).forEach(function (el) {
        el.textContent = (S.menu.pizzas || []).filter(function (p) { return p.category === item.id; }).length;
      });
      $$('[data-cat-section]', frag).forEach(function (sec) {
        sec.id = 'cat-' + item.id;
        sec.setAttribute('data-cat', item.id);
        sec.setAttribute('aria-labelledby', 'cat-' + item.id + '-title');
      });
      $$('[data-cat-title]', frag).forEach(function (h) {
        h.id = 'cat-' + item.id + '-title';
        h.textContent = (item.title + ' ' + (S.menu.page.sectionSuffix || '')).trim();
      });
      $$('[data-pizzas-category]', frag).forEach(function (ul) { ul.setAttribute('data-pizzas', 'category:' + item.id); });
      container.appendChild(frag);
    });
  }
  // menu page: no chips needed for a single category
  if ((S.menu && S.menu.categories || []).length < 2) $$('nav.chips').forEach(function (n) { n.remove(); });
  // repeat until nested lists are done (e.g. socials inside cloned content)
  var guard = 0, pending;
  while ((pending = $$('[data-list]:not([data-rendered])')).length && guard++ < 5) {
    pending.forEach(function (c) { c.setAttribute('data-rendered', ''); renderList(c); });
  }

  /* ---------- 2. pizzas (cards + popups) ---------- */
  var M = S.menu || {};
  function renderPizza(p, eager) {
    var tpl = document.getElementById('tpl-pizza');
    var frag = tpl.content.cloneNode(true);
    // "199 ₴" — an empty value removes the price element
    p = Object.assign({ priceText: p.price ? p.price + '\u00a0' + ((S.common.pizza || {}).currency || '₴') + (p.unit ? '\u00a0/\u00a0' + p.unit : '') : '' }, p);
    fillItem(frag, p, 0);
    var article = frag.querySelector('[data-pizza-article]');
    article.id = p.id;
    var card = frag.querySelector('.pcard');
    card.setAttribute('data-pizza', p.id);
    card.setAttribute('aria-controls', 'pz-' + p.id);
    var dlg = frag.querySelector('dialog');
    dlg.id = 'pz-' + p.id;
    dlg.setAttribute('aria-labelledby', 'pz-' + p.id + '-title');
    frag.querySelector('.pdialog__title').id = 'pz-' + p.id + '-title';
    $$('[data-pizza-img]', frag).forEach(function (img, i) {
      var base = 'assets/images/pizza/' + p.image;
      img.src = base + '-800.webp';
      img.srcset = base + '-480.webp 480w, ' + base + '-800.webp 800w';
      img.sizes = i === 0 ? '(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw' : '(min-width: 640px) 340px, 100vw';
      if (i === 0) {
        img.alt = p.alt || p.name;
        if (eager) { img.removeAttribute('loading'); img.setAttribute('fetchpriority', 'high'); }
      }
    });
    // Extra photos (morePhotos) → swipeable gallery with dots in the popup
    var extra = (p.morePhotos || []).map(function (ph) { return typeof ph === 'string' ? { image: ph } : ph; });
    if (extra.length) {
      var media = frag.querySelector('.pdialog__media');
      var track = document.createElement('div');
      track.className = 'pgallery';
      track.setAttribute('data-gallery', '');
      var first = media.querySelector('img');
      first.alt = p.alt || p.name;
      track.appendChild(first);
      extra.forEach(function (ph, n) {
        var img = document.createElement('img'), base = 'assets/images/pizza/' + ph.image;
        img.src = base + '-800.webp';
        img.srcset = base + '-480.webp 480w, ' + base + '-800.webp 800w';
        img.sizes = '(min-width: 640px) 340px, 100vw';
        img.width = 800; img.height = 600; img.loading = 'lazy'; img.decoding = 'async';
        img.alt = ph.alt || p.name + ' — ' + (n + 2);
        track.appendChild(img);
      });
      var dots = document.createElement('div');
      dots.className = 'pgallery__dots';
      for (var k = 0; k <= extra.length; k++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'pgallery__dot';
        d.setAttribute('data-gallery-dot', k);
        d.setAttribute('aria-label', String((S.common.pizza || {}).photo || '{n} / {total}').replace('{n}', k + 1).replace('{total}', extra.length + 1));
        if (k === 0) d.setAttribute('aria-current', 'true');
        dots.appendChild(d);
      }
      media.appendChild(track);
      media.appendChild(dots);
    }
    $$('[data-pizza-tags]', frag).forEach(function (box) {
      if (!p.tags || !p.tags.length) { box.remove(); return; }
      p.tags.forEach(function (t) {
        var s = document.createElement('span');
        s.className = 'tag tag--' + t;
        s.textContent = (M.tags || {})[t] || t;
        box.appendChild(s);
      });
    });
    if (p.dough === false) $$('.is-dough', frag).forEach(function (li) { li.remove(); }); // pastry: no sourdough line
    var ul = frag.querySelector('[data-pizza-ingredients]');
    (p.ingredients || []).forEach(function (ing) {
      var li = document.createElement('li');
      li.textContent = ing;
      ul.appendChild(li);
    });
    $$('[data-pizza-track]', frag).forEach(function (a) { a.setAttribute('data-track', 'pizza-' + p.id); });
    return frag;
  }
  $$('[data-pizzas]').forEach(function (ul, listIndex) {
    var mode = ul.getAttribute('data-pizzas');
    var pizzas = mode === 'featured'
      ? (M.featured || []).map(function (id) { return (M.pizzas || []).find(function (p) { return p.id === id; }); }).filter(Boolean)
      : (M.pizzas || []).filter(function (p) { return 'category:' + p.category === mode; });
    var compact = mode === 'featured';
    pizzas.forEach(function (p, i) {
      var frag = renderPizza(p, !compact && listIndex === 0 && i === 0);
      if (compact) $$('.pcard__it', frag).forEach(function (el) { el.remove(); }); // keep small cards clean
      ul.appendChild(frag);
    });
  });

  /* ---------- 3. texts & attributes ---------- */
  $$('[data-t]').forEach(function (el) {
    var v = get(el.getAttribute('data-t'));
    if (v == null) return warn(el.getAttribute('data-t'));
    el.textContent = fill(v);
  });
  $$('[data-html]').forEach(function (el) {
    var v = get(el.getAttribute('data-html'));
    if (v == null) return warn(el.getAttribute('data-html'));
    el.innerHTML = fill(v);
  });
  $$('[data-alt]').forEach(function (el) { el.alt = fill(get(el.getAttribute('data-alt'))); });
  $$('[data-aria]').forEach(function (el) { el.setAttribute('aria-label', fill(get(el.getAttribute('data-aria')))); });
  $$('[data-tel]').forEach(function (a) { a.href = TEL; });
  $$('[data-messenger]').forEach(function (a) {
    var kind = a.getAttribute('data-messenger');
    if (!MS[kind]) { a.remove(); return; } // no number / username → no button
    a.href = S.messengerUrl(kind, S.common.messengers && S.common.messengers.orderText);
    if (kind === 'telegram') { a.target = '_blank'; a.rel = 'noopener'; }
  });
  $$('.msg-btns').forEach(function (box) { if (!box.children.length) (box.closest('.hero__msg') || box).remove(); });
  $$('[data-phone]').forEach(function (el) { el.textContent = nbsp(C.phoneDisplay || ''); });
  $$('[data-maps-route]').forEach(function (a) { a.href = LINKS.route; });
  $$('[data-google-maps]').forEach(function (a) { if (C.googleMaps) a.href = C.googleMaps; else a.remove(); });
  $$('[data-maps-embed]').forEach(function (f) { f.src = LINKS.embed; f.title = 'Карта: ' + C.fullName + ', ' + VARS.fullAddress; });
  $$('[data-instagram]').forEach(function (a) { a.href = LINKS.instagram; });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$('[data-open-status]').forEach(function (el) { el.textContent = C.hoursShort || ''; }); // updated live by main.js
  $$('[data-t="common.footer.about"]').forEach(function (el) { el.textContent = fill(S.common.footer.about); });

  /* ---------- 4. structured data for Google (JSON-LD), generated from the same data ---------- */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var canonical = document.querySelector('link[rel="canonical"]');
  var siteUrl = canonical ? canonical.href.replace(/[^/]*$/, '') : location.href.replace(/[^/]*$/, '');
  var isMenu = !!document.querySelector('[data-cat-section], [data-pizzas^="category:"]');
  var ld = isMenu ? {
    '@context': 'https://schema.org', '@type': 'Menu', name: 'Меню — ' + C.fullName, inLanguage: 'uk', url: siteUrl + 'menu',
    hasMenuSection: (M.categories || []).map(function (c) {
      return {
        '@type': 'MenuSection', name: (c.title + ' ' + (M.page.sectionSuffix || '')).trim(),
        hasMenuItem: M.pizzas.filter(function (p) { return p.category === c.id; }).map(function (p) {
          return { '@type': 'MenuItem', name: p.name, url: siteUrl + 'menu#' + p.id, image: siteUrl + 'assets/images/pizza/' + p.image + '-800.webp',
            description: (p.dough === false ? '' : S.common.pizza.dough + '; ') + p.ingredients.join(', ').toLowerCase() + '.',
            offers: p.price ? { '@type': 'Offer', price: p.price, priceCurrency: 'UAH',
              // sold by weight → price per 1 kg
              priceSpecification: p.unit === 'кг' ? { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'UAH', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'KGM' } } : undefined } : undefined };
        }),
      };
    }),
  } : {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: C.fullName, alternateName: C.venue || undefined, url: siteUrl,
    image: siteUrl + 'assets/images/og-image.jpg', telephone: C.phone, servesCuisine: 'Pizza', priceRange: (function () { var ps = (M.pizzas || []).filter(function (p) { return p.dough !== false; }).map(function (p) { return p.price; }).filter(Boolean); return ps.length ? Math.min.apply(null, ps) + '–' + Math.max.apply(null, ps) + ' UAH' : '₴'; })(), hasMenu: siteUrl + 'menu',
    address: { '@type': 'PostalAddress', streetAddress: A.street, addressLocality: A.villageName, addressRegion: A.district + ', ' + A.region, addressCountry: 'UA' },
    geo: HAS_GEO ? { '@type': 'GeoCoordinates', latitude: Number(A.lat), longitude: Number(A.lng) } : undefined,
    hasMap: C.googleMaps || 'https://www.google.com/maps/search/?api=1&query=' + MAPS_Q,
    openingHoursSpecification: (C.hours || []).map(function (h) {
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.map(function (d) { return DAYS[d]; }), opens: h.opens, closes: h.closes };
    }),
    sameAs: (C.socials || []).map(function (s) { return s.url; }).filter(function (u, i, all) { return u && all.indexOf(u) === i; }),
  };
  if (document.querySelector('main .notfound')) ld = null;
  // FAQ block on the home page → FAQPage data for Google
  var faq = S.home && S.home.faq;
  if (ld && !isMenu && faq && faq.items && document.querySelector('[data-list="home.faq.items"]')) {
    var faqLd = document.createElement('script');
    faqLd.type = 'application/ld+json';
    faqLd.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.items.map(function (it) {
      return { '@type': 'Question', name: fill(it.q).replace(/\u00a0/g, ' '), acceptedAnswer: { '@type': 'Answer', text: fill(it.a).replace(/\u00a0/g, ' ') } };
    }) });
    document.head.appendChild(faqLd);
  }
  document.documentElement.classList.add('ready'); // show the filled page (see style.css)
  if (ld) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }
})();
