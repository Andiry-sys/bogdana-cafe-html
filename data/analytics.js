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
  // Google tag from the GA4 setup (snippet with googletagmanager.com/gtm.js?id=…). Contains GA4 G-PJHVSJ2BW2.
  googleTag: 'GTM-KN7HC6BB',
  ga4: '',       // alternative: GA4 "Measurement ID" 'G-…' directly. Use googleTag OR ga4, not both (double counting)
  metaPixel: '', // Meta (Facebook / Instagram ads) Pixel ID, digits only, e.g. '123456789012345'
  clarity: '',   // Microsoft Clarity (free heatmaps + session recordings) project ID, e.g. 'abcd1234ef'
};
