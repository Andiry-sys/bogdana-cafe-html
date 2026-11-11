/* =========================================================================
   COMMON TEXTS — header, footer, bottom bar on phones, pizza popup, 404 page.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.common = {
  skipLink: 'Перейти до змісту',
  nav: {
    menu: 'Меню',
    sourdough: 'Закваска',
    contacts: 'Контакти',
    home: 'Головна',
  },
  callButton: 'Зателефонувати',
  callShort: 'Подзвонити', // bottom bar on phones (little space)
  callAndOrder: 'Зателефонувати й замовити',

  // Viber / Telegram buttons. The order text is pre-typed in Telegram (and in Viber for a Viber Business account).
  messengers: {
    viber: 'Viber',
    telegram: 'Telegram',
    viberAria: 'Замовити у Viber',
    telegramAria: 'Замовити в Telegram',
    orderText: 'Добрий день! Хочу замовити піцу на самовивіз.',
    orderPizzaText: 'Добрий день! Хочу замовити піцу «{pizza}» на самовивіз.', // {pizza} = name from the popup
  },
  close: 'Закрити',
  address: 'Адреса',

  openStatus: {
    open: 'Відчинено зараз · до {time}',
    opensToday: 'Сьогодні відкриємося о {time}',
    closed: 'Зараз зачинено',
  },

  pizza: {
    more: 'Склад і замовлення',
    currency: '₴',
    ingredientsTitle: 'Склад',
    dough: 'Тісто на живій заквасці, без дріжджів',
    prev: 'Попередня піца',
    next: 'Наступна піца',
  },

  footer: {
    about: '{fullName} — у магазині-кафе «Богдана». Піца на живій заквасці, без дріжджів. Самовивіз.',
    pagesTitle: 'Сторінки',
    orderTitle: 'Замовлення',
    links: {
      home: 'Головна',
      menu: 'Меню',
      sourdough: 'Про закваску',
      contacts: 'Адреса й графік',
    },
  },

  noscript: 'Для повної версії сайту увімкніть JavaScript у браузері.',

  notFound: {
    eyebrow: '404',
    title: 'Цієї сторінки немає',
    text: 'Зате піца є. Подивіться меню або просто зателефонуйте.',
    menuButton: 'Меню',
  },
};
