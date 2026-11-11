/* =========================================================================
   CONTACTS + ADDRESS — the only place with phone, address, hours and socials.
   Everything on every page (buttons, footer, map, Google data) is filled from here.
   PLACEHOLDER = still needs the client's real data.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.contacts = {
  name: 'Брусенки',            // big italic word in the logo
  kind: 'Піцерія',             // small caps word above it
  fullName: 'Піцерія Брусенки',
  // The shop the pizzeria is in (old site name). Shown small under the address and sent to Google
  // as an alternative name, so people and Google who know «Богдана» still find us. '' hides it.
  venue: 'Магазин-кафе «Богдана»',
  venueLine: 'У магазині-кафе «Богдана»',

  // Phone: `phone` is used for the call link, `phoneDisplay` is what people see.
  phone: '+380956502219',
  phoneDisplay: '095 650 22 19',

  // Order via messengers. Empty value ('') hides that button everywhere.
  messengers: {
    viber: '+380956502219', // number with Viber, international format
    // false = personal Viber: the button opens the chat with this number (empty message field).
    // true  = the number is a registered Viber Business account: official link viber.me/… with the order text pre-typed.
    viberBusiness: false,
    telegram: 'bohdanka_ff', // Telegram username without @
  },

  address: {
    street: 'вул. Богдана Хмельницького, 43А',
    village: 'с. Брусенки',
    villageName: 'Брусенки',
    district: 'Вижницький район',
    region: 'Чернівецька область',
    // Exact point on the map: used for the map on the page, "Прокласти маршрут" and Google data.
    // To change: Google Maps → right-click the building → click the numbers to copy them.
    lat: 48.2955665,
    lng: 25.5424469,
    // Used only if lat/lng are empty. When the cafe has a Google Maps profile, put its exact name here.
    mapsQuery: 'вул. Богдана Хмельницького 43А, Брусенки, Чернівецька область',
  },

  // Pickup only — time from the call to "pizza is ready", in minutes (a number or a range like '30–40')
  readyMinutes: '30–40',

  // PLACEHOLDER: opening hours. days: 0 = Sunday, 1 = Monday … 6 = Saturday
  hours: [
    { label: 'Пн–Пт', days: [1, 2, 3, 4, 5], opens: '10:00', closes: '21:00' },
    { label: 'Сб–Нд', days: [6, 0], opens: '11:00', closes: '21:00' },
  ],
  hoursShort: 'Пн–Пт з 10:00, Сб–Нд з 11:00', // footer + «Зараз зачинено · …»

  // Google Maps profile (rating, reviews, photos). Used for «Відгуки в Google» and for Google data.
  // To change: open the profile on Google Maps → Share → copy the link.
  googleMaps: 'https://maps.google.com/?cid=4226999667722841224',

  // Social networks. Add / remove lines. icon: instagram | tiktok | facebook | telegram | google
  instagram: 'pizza.brusenky', // handle for the Instagram block (without @)
  socials: [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/pizza.brusenky/' },
    // { icon: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@…' },
    // { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/bogdana.cafe' },
    // { icon: 'telegram', label: 'Telegram', url: 'https://t.me/bogdana_cafe' },
    { icon: 'google', label: 'Ми на Google Maps', url: 'https://maps.google.com/?cid=4226999667722841224' },
  ],
};
