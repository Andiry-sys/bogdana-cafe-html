/* =========================================================================
   CONTACTS + ADDRESS — the only place with phone, address, hours and socials.
   Everything on every page (buttons, footer, map, Google data) is filled from here.
   PLACEHOLDER = still needs the client's real data.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.contacts = {
  name: 'Богдана',
  fullName: 'Магазин-кафе «Богдана»',
  kind: 'Магазин-кафе',

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
    // Text for Google Maps (map on the page + "Прокласти маршрут").
    // When the cafe has a Google Maps profile, put its exact name here.
    mapsQuery: 'вул. Богдана Хмельницького 43А, Брусенки, Чернівецька область',
  },

  // Pickup only — average time from the call to "pizza is ready" (minutes)
  readyMinutes: 40,

  // PLACEHOLDER: opening hours. days: 0 = Sunday, 1 = Monday … 6 = Saturday
  hours: [
    { label: 'Пн–Пт', days: [1, 2, 3, 4, 5], opens: '10:00', closes: '21:00' },
    { label: 'Сб–Нд', days: [6, 0], opens: '11:00', closes: '21:00' },
  ],
  hoursShort: 'Щодня з 10:00',

  // Social networks. Add / remove lines. icon: instagram | tiktok | facebook | telegram | google
  instagram: 'pizza.brusenky', // handle for the Instagram block (without @)
  socials: [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/pizza.brusenky/' },
    // { icon: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@…' },
    // { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/bogdana.cafe' },
    // { icon: 'telegram', label: 'Telegram', url: 'https://t.me/bogdana_cafe' },
    { icon: 'google', label: 'Ми на Google Maps', url: 'https://www.google.com/maps/search/?api=1&query=Магазин-кафе+Богдана+Брусенки' },
  ],
};
