/* =========================================================================
   ANALYTICS — paste your IDs here (one place for all pages). Empty '' = turned off.
   The counters load only on the published site (not when the file is opened locally
   or on localhost), so your own tests don't spoil the statistics.
   Tracked automatically (assets/js/main.js):
     call_click       — tap on the phone number (GA4) / "Contact" (Meta Pixel)
     messenger_click  — tap on Viber / Telegram (GA4)  / "Contact" (Meta Pixel)
     view_pizza       — a pizza popup was opened (GA4)
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.analytics = {
  ga4: '',       // Google Analytics 4 → "Measurement ID", looks like 'G-AB12CD34EF'
  metaPixel: '', // Meta (Facebook / Instagram ads) Pixel ID, digits only, e.g. '123456789012345'
  clarity: '',   // Microsoft Clarity (free heatmaps + session recordings) project ID, e.g. 'abcd1234ef'
};
