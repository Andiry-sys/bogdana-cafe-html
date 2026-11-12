/* =========================================================================
   Піцерія Брусенки — small enhancements (no libraries).
   The site works without this file: phone links, menu and contacts are plain HTML.
   Runs after assets/js/render.js has put the texts from /data into the page.
   1. "Відчинено зараз" label — computed from the hours in data/contacts.js
   2. Header shadow on scroll
   3. Reveal fallback for browsers without CSS scroll-driven animations
   4. Pizza popups (<dialog>) + deep links menu.html#margherita + ‹ › next / previous pizza
   5. Active category chip on the menu page
   6. Analytics hook: tracks taps on phone numbers / messengers if GA4 / Meta Pixel are installed
   7. Order via Viber / Telegram: pizza name in the pre-typed message
   ========================================================================= */

(function () {
  'use strict';

  /* ---------- 1. Opening hours — from data/contacts.js ---------- */
  var SITE = window.SITE || {};
  var HOURS = (SITE.contacts && SITE.contacts.hours) || [];
  var HOURS_SHORT = (SITE.contacts && SITE.contacts.hoursShort) || '';
  var T = (SITE.common && SITE.common.openStatus) || { open: 'Відчинено · до {time}', opensToday: 'Відкриємося о {time}', closed: 'Зачинено' };

  var root = document.documentElement;

  /* ---------- 2. Header state on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (header) header.toggleAttribute('data-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. Reveal fallback ---------- */
  if (!root.classList.contains('sda')) {
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* "Open now" label */
  function toMin(s) { return Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5)); }
  function openStatus() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ''; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var now = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
    var today = HOURS.find(function (h) { return h.days.indexOf(day) !== -1; });
    if (today && now >= toMin(today.opens) && now < toMin(today.closes)) return { open: true, text: T.open.replace('{time}', today.closes) };
    if (today && now < toMin(today.opens)) return { open: false, text: T.opensToday.replace('{time}', today.opens) };
    return { open: false, text: T.closed + ' · ' + HOURS_SHORT };
  }
  // text + green (open) / red (closed) dot; re-checked every minute
  function showOpenStatus() {
    var st = openStatus();
    root.setAttribute('data-open-now', st.open ? 'true' : 'false');
    document.querySelectorAll('[data-open-status]').forEach(function (el) { el.textContent = st.text; });
  }
  showOpenStatus();
  setInterval(showOpenStatus, 60000);

  /* ---------- 4. Pizza popups ---------- */
  function dialogFor(id) { return document.getElementById('pz-' + id); }

  function openPizza(id, updateUrl) {
    var dlg = dialogFor(id);
    if (!dlg || dlg.open || typeof dlg.showModal !== 'function') return;
    dlg.showModal();
    root.classList.add('no-scroll');
    if (updateUrl !== false) history.replaceState(null, '', '#' + id);
    track('view_pizza', { pizza: id });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var trigger = t.closest('[data-pizza]');
    if (trigger) { openPizza(trigger.getAttribute('data-pizza')); return; }
    if (t.closest('[data-close]')) { var d = t.closest('dialog'); if (d) d.close(); }
    // click on the dark backdrop closes the popup
    if (t.tagName === 'DIALOG' && t.classList.contains('pdialog')) t.close();
  });

  document.querySelectorAll('dialog.pdialog').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      if (!document.querySelector('dialog.pdialog[open]')) root.classList.remove('no-scroll'); // not when switching to the next pizza
      if (location.hash === '#' + dlg.id.slice(3)) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  /* ‹ › previous / next pizza inside the popup: arrow buttons, ← → keys, swipe on phones.
     Goes through the pizzas of the same list (menu page: whole menu; home page: the 4 cards) and loops. */
  function pizzaList(dlg) {
    var list = dlg.closest('[data-pizzas]');
    return Array.prototype.slice.call((list || document).querySelectorAll('dialog.pdialog'));
  }
  function stepPizza(dlg, dir, focusNav) {
    var all = pizzaList(dlg);
    if (all.length < 2) return;
    var next = all[(all.indexOf(dlg) + dir + all.length) % all.length];
    dlg.close();
    openPizza(next.id.slice(3));
    if (focusNav) { var b = next.querySelector('[data-pizza-nav="' + dir + '"]'); if (b) b.focus(); }
  }
  document.querySelectorAll('dialog.pdialog').forEach(function (dlg) {
    var all = pizzaList(dlg);
    if (all.length < 2) dlg.querySelectorAll('[data-pizza-nav]').forEach(function (b) { b.hidden = true; });
    // load the neighbours' photos when this popup opens, so the arrows feel instant
    dlg.addEventListener('toggle', function () {
      if (!dlg.open) return;
      var i = all.indexOf(dlg);
      [all[(i + 1) % all.length], all[(i - 1 + all.length) % all.length]].forEach(function (d) {
        d.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
      });
    });
    var x0 = null, y0 = 0;
    dlg.addEventListener('touchstart', function (e) {
      if (e.target.closest('[data-gallery]')) { x0 = null; return; } // swipe on several photos = next photo, not next item
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepPizza(dlg, dx < 0 ? 1 : -1);
    }, { passive: true });
  });
  /* Several photos in a popup (data/menu.js → morePhotos): swipe or tap the dots */
  var smooth = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    var dots = g.parentNode.querySelectorAll('[data-gallery-dot]'), raf = 0;
    g.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var i = Math.round(g.scrollLeft / (g.clientWidth || 1));
        dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      });
    }, { passive: true });
    var dlg = g.closest('dialog');
    if (dlg) dlg.addEventListener('close', function () { g.scrollLeft = 0; }); // next time starts from the first photo
  });
  document.addEventListener('click', function (e) {
    var d = e.target.closest('[data-gallery-dot]');
    if (!d) return;
    var g = d.parentNode.parentNode.querySelector('[data-gallery]');
    g.scrollTo({ left: g.clientWidth * Number(d.getAttribute('data-gallery-dot')), behavior: smooth ? 'smooth' : 'auto' });
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pizza-nav]');
    if (b) stepPizza(b.closest('dialog'), Number(b.getAttribute('data-pizza-nav')), true);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var dlg = document.querySelector('dialog.pdialog[open]');
    if (dlg) { e.preventDefault(); stepPizza(dlg, e.key === 'ArrowRight' ? 1 : -1); }
  });

  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (id && dialogFor(id)) openPizza(id, false);
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- 5. Active category chip (menu page) ---------- */
  var chips = document.querySelectorAll('[data-cat-link]');
  var cats = document.querySelectorAll('[data-cat]');
  if (chips.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      chips.forEach(function (c) { c.toggleAttribute('data-active', c.getAttribute('data-cat-link') === id); });
    };
    setActive(cats[0] ? cats[0].getAttribute('data-cat') : '');
    var catIo = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible[0]) setActive(visible[0].target.getAttribute('data-cat'));
    }, { rootMargin: '-35% 0px -55% 0px' });
    cats.forEach(function (c) { catIo.observe(c); });
  }

  /* ---------- 6. Analytics hook ----------
   * Works automatically once the GA4 and/or Meta Pixel snippets are pasted into <head>
   * (see the ANALYTICS comment in index.html / menu.html). Does nothing otherwise.
   *  - every tap on a phone number → GA4 event "call_click", Pixel event "Contact"
   *  - tap on Viber / Telegram      → GA4 event "messenger_click" (messenger, location), Pixel "Contact"
   *  - opening a pizza popup        → GA4 event "view_pizza"
   */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    if (typeof window.fbq === 'function' && (name === 'call_click' || name === 'messenger_click')) window.fbq('track', 'Contact');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"]');
    if (a) track('call_click', { location: a.getAttribute('data-track') || 'page', page: location.pathname });
  });

  /* ---------- 7. Order via Viber / Telegram ---------- */
  var MSG = (window.SITE && SITE.common && SITE.common.messengers) || {};
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-messenger]');
    if (!a || typeof SITE.messengerUrl !== 'function') return;
    var kind = a.getAttribute('data-messenger');
    var title = a.closest('dialog') && a.closest('dialog').querySelector('.pdialog__title');
    var text = title ? (MSG.orderPizzaText || '').replace('{pizza}', title.textContent.trim()) : MSG.orderText;
    a.href = SITE.messengerUrl(kind, text); // pizza name in the message; the link opens right after this handler
    track('messenger_click', { messenger: kind, location: a.getAttribute('data-track') || 'page', page: location.pathname });
  });
})();
