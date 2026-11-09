/* =========================================================================
   Магазин-кафе «Богдана» — small enhancements (no libraries).
   The site works without this file: phone links, menu and contacts are plain HTML.
   Runs after assets/js/render.js has put the texts from /data into the page.
   1. "Відчинено зараз" label — computed from the hours in data/contacts.js
   2. Header shadow on scroll
   3. Reveal fallback for browsers without CSS scroll-driven animations
   4. Pizza popups (<dialog>) + deep links menu.html#margherita
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
    if (today && now >= toMin(today.opens) && now < toMin(today.closes)) return T.open.replace('{time}', today.closes);
    if (today && now < toMin(today.opens)) return T.opensToday.replace('{time}', today.opens);
    return T.closed + ' · ' + HOURS_SHORT;
  }
  document.querySelectorAll('[data-open-status]').forEach(function (el) { el.textContent = openStatus(); });

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
      root.classList.remove('no-scroll');
      if (location.hash === '#' + dlg.id.slice(3)) history.replaceState(null, '', location.pathname + location.search);
    });
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
