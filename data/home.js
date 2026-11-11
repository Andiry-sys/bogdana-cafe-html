/* =========================================================================
   HOME PAGE TEXTS (index.html)
   - Plain text, or simple HTML where noted: <em>…</em> = red italic, <strong>…</strong> = bold.
   - {curly} words are filled automatically: {readyMinutes}, {street}, {fullAddress}, {villageName},
     {fermentationHours}, {phoneDisplay}, {instagram}.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.home = {
  // How long the dough ferments (number) — used in the story and the counter. Confirmed: 3 hours.
  fermentationHours: 3,

  hero: {
    eyebrowLong: '',                  // extra words before the eyebrow, hidden on phones
    eyebrow: 'Піцерія · {villageName}',
    titleLines: ['Піца', 'на <em>живій</em>', 'заквасці'], // HTML allowed
    lead: '<strong>Без дріжджів</strong> — тісто піднімає жива закваска. Звідси легка кислинка, хрустка скоринка й повітряні пори.', // HTML allowed
    callButton: 'Зателефонувати',
    menuButton: 'Дивитися меню',
    messengersLabel: 'Або напишіть:',
    facts: {
      ready: 'Готуємо {readyMinutes} хв',
      pickup: 'Самовивіз: {fullAddress}',
    },
    imageAlt: 'Піца «Салямі» на заквасці з оливками, вигляд згори',
    sticker: { ring: 'ЖИВА ЗАКВАСКА ✺ БЕЗ ДРІЖДЖІВ ✺ ПІЦА ✺', big: '0', small: 'дріжджів' },
  },

  // Running text band under the first screen
  marquee: ['Жива закваска', 'Без дріжджів', 'Хрустка скоринка', 'Готуємо {readyMinutes} хв', 'Самовивіз', '{villageName}'],

  sourdough: {
    eyebrow: 'Наша фішка',
    title: 'Закваска <em>замість</em> дріжджів', // HTML allowed
    intro: 'Звичайне тісто піднімають промислові дріжджі — швидко й просто. Наше піднімає <strong>жива закваска</strong>: культура диких дріжджів і молочнокислих бактерій, яку ми підгодовуємо щодня. Це повільніше, але саме так тісто встигає набрати смак.', // HTML allowed
    doughAlt: 'Тісто на заквасці підіймається під час бродіння',
    counterLabel: 'години бродіння',
    steps: [
      { title: 'Щодня годуємо закваску', text: 'Борошно й вода — щоранку. Закваска жива, тож працює за своїм розкладом, а не за нашим.' },
      { title: '{fermentationHours} години бродіння', text: 'Закваска спокійно піднімає тісто — без жодних дріжджів. Так з’являються аромат, легка кислинка й повітряні пори.' },
      { title: 'Печемо на замовлення', text: 'Ви телефонуєте — ми розтягуємо тісто й печемо його в професійній ресторанній духовці.' },
      { title: 'Забираєте гарячою', text: 'За {readyMinutes} хвилин піца чекає на вас за адресою: {fullAddress}.' },
    ],
    perks: [
      { icon: 'leaf', title: 'Смак', text: 'Легка кислинка й глибина смаку, якої не дають швидкі дріжджі.' },
      { icon: 'wheat', title: 'Текстура', text: 'Хрустка скоринка зовні, повітряні пори всередині.' },
      // PLACEHOLDER: confirm the dough ingredients with the client
      { icon: 'check', title: 'Чесний склад', text: 'Борошно, вода, сіль і закваска. Жодних промислових дріжджів.' },
    ],
  },

  hits: {
    eyebrow: 'Меню',
    title: 'Смачна піца зі свіжих інгредієнтів',
    allMenu: 'Усе меню',
  },

  callBand: {
    title: 'Зголодніли?',
    text: 'Телефонуйте — за {readyMinutes} хвилин піца чекатиме на вас за адресою: {fullAddress}.',
  },

  instagram: {
    eyebrow: 'Instagram',
    follow: 'Підписатися',
    // Placeholder tiles (shown until the automatic feed is set up — see README → Instagram).
    // Photos: assets/images/instagram/1-640.webp … 5-640.webp. Real posts come from data/instagram.js.
    photos: [
      'Піца «Маргарита» на дерев’яній дошці',
      'Кульки тіста на заквасці перед випіканням',
      'Піца «Салямі» великим планом',
      'Піца «Чотири сезони»',
      'Грибна піца з білими грибами',
    ],
  },

  // Frequently asked questions (shown above Contacts, also sent to Google as FAQ data).
  // {curly} words are filled automatically: {priceMin}/{priceMax} from data/menu.js, {hoursText} from data/contacts.js.
  faq: {
    eyebrow: 'Питання й відповіді',
    title: 'Часті запитання',
    items: [
      { q: 'Де замовити піцу в Брусенках?', a: 'У нашій піцерії в магазині-кафе «Богдана»: {fullAddress}. Телефонуйте {phoneDisplay} або пишіть у Viber чи Telegram — піца буде готова за {readyMinutes} хвилин.' },
      { q: 'Чи є доставка?', a: 'Доставки немає, лише самовивіз. Замовте заздалегідь — і заберете піцу гарячою. До нас зручно під’їхати з Брусниці та інших сусідніх сіл.' },
      { q: 'Скільки готується піца?', a: '{readyMinutes} хвилин від дзвінка чи повідомлення. Тісто вже чекає: воно бродить {fermentationHours} години на живій заквасці.' },
      { q: 'Чим піца на заквасці відрізняється від звичайної?', a: 'Тісто піднімає жива закваска, а не дріжджі. Завдяки довгому бродінню з’являються легка кислинка, хрустка скоринка й повітряні пори.' },
      { q: 'Скільки коштує піца?', a: 'Від {priceMin} до {priceMax} ₴. Ціну й склад кожної піци дивіться в меню.' },
      { q: 'Коли ви працюєте?', a: '{hoursText}.' },
    ],
  },

  contacts: {
    eyebrow: 'Самовивіз',
    title: 'Де нас знайти',
    addressLabel: 'Адреса',
    route: 'Прокласти маршрут',
    reviews: 'Відгуки в Google',
    hoursLabel: 'Графік',
    orderLabel: 'Замовлення',
    socialsLabel: 'Соцмережі',
    mapOpen: 'Відкрити в Google Maps',
  },
};
