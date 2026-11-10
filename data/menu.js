/* =========================================================================
   MENU — pizzas, categories, tags (used by menu.html and the 4 cards on index.html)
   Source: the cafe's paper menu.
   To add a pizza: copy one { … } block, give it a new unique id and photos
   assets/images/pizza/<image>-480.webp and <image>-800.webp.
   The link menu.html#<id> opens that pizza directly (handy for Instagram stories).
   price: number in ₴ (shown on the card and in the popup; remove the field to hide the price).
   Optional fields: tags: ['new'] (see `tags` below), nameIt: 'Margherita' (small Italian name on the card).
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.menu = {
  page: {
    breadcrumbsLabel: 'Хлібні крихти',
    title: 'Меню <em>на заквасці</em>', // HTML allowed
    intro: 'Уся піца — на живій заквасці, без жодних дріжджів. Натисніть на піцу, щоб побачити склад, і телефонуйте — приготуємо за {readyMinutes} хвилин.',
    categoriesLabel: 'Категорії',
    sectionSuffix: '', // added after each category title, e.g. 'піци' → "Класичні піци"; empty = nothing
  },

  // 4 pizzas shown on the home page
  featured: ['margherita', 'salami', 'quattro-formaggi', 'hawaiian'],

  tags: {
    veg: 'Вегетаріанська',
    spicy: 'Гостра',
    hit: 'Хіт',
    new: 'Новинка',
  },

  // One category → the category chips are hidden automatically. Add more to split the menu.
  categories: [
    { id: 'pizza', title: 'Наша піца', subtitle: 'Смачна піца зі свіжих інгредієнтів' },
  ],

  pizzas: [
    {
      id: 'salami', category: 'pizza', image: 'salami', price: 199,
      name: 'Салямі',
      short: 'Соус пелаті, моцарела, салямі, оливки',
      ingredients: ['Соус пелаті', 'Моцарела', 'Салямі', 'Оливки'],
      alt: 'Піца «Салямі» зі скибочками салямі та оливками',
    },
    {
      id: 'chicken', category: 'pizza', image: 'chicken', price: 215,
      name: 'Піца з куркою',
      short: 'Соус бешамель, моцарела, курка, бекон',
      ingredients: ['Соус бешамель', 'Моцарела', 'Курка', 'Бекон'],
      alt: 'Піца з куркою та беконом на білому соусі',
    },
    {
      id: 'quattro-formaggi', category: 'pizza', image: 'quattro-formaggi', price: 250,
      name: 'Чотири сири',
      short: 'Соус бешамель, моцарела, брі, горгонзола, пармезан',
      ingredients: ['Соус бешамель', 'Моцарела', 'Брі', 'Горгонзола', 'Пармезан'],
      alt: 'Піца «Чотири сири» з розплавленим сиром',
    },
    {
      id: 'mushroom', category: 'pizza', image: 'mushroom', price: 198,
      name: 'Грибна',
      short: 'Соус бешамель, моцарела, печериці, білі гриби, дорблю',
      ingredients: ['Соус бешамель', 'Моцарела', 'Печериці', 'Білі гриби', 'Сир дорблю'],
      alt: 'Грибна піца з печерицями та білими грибами',
    },
    {
      id: 'margherita', category: 'pizza', image: 'margherita', price: 140,
      name: 'Маргарита',
      short: 'Соус пелаті, моцарела, помідори',
      ingredients: ['Соус пелаті', 'Моцарела', 'Помідори'],
      alt: 'Піца «Маргарита» з моцарелою та помідорами',
    },
    {
      id: 'quattro-stagioni', category: 'pizza', image: 'quattro-stagioni', price: 304,
      name: 'Чотири сезони',
      short: 'Соус пелаті, моцарела, бекон, гриби, салямі, оливки',
      ingredients: ['Соус пелаті', 'Моцарела', 'Бекон', 'Гриби', 'Салямі', 'Оливки'],
      alt: 'Піца «Чотири сезони» з беконом, грибами, салямі та оливками',
    },
    {
      id: 'caesar', category: 'pizza', image: 'caesar', price: 289,
      name: 'Цезар',
      short: 'Соус бешамель, куряче філе, моцарела, помідори, пармезан, листя салату',
      ingredients: ['Соус бешамель', 'Куряче філе', 'Моцарела', 'Помідори', 'Пармезан', 'Листя салату'],
      alt: 'Піца «Цезар» з куркою, помідорами та листям салату',
    },
    {
      id: 'hawaiian', category: 'pizza', image: 'hawaiian', price: 250, tags: ['new'],
      name: 'Гавайська',
      short: 'Вершковий соус, моцарела, куряче філе, ананаси',
      ingredients: ['Вершковий соус', 'Моцарела', 'Куряче філе', 'Ананаси'],
      alt: 'Піца «Гавайська» з куркою та ананасами',
    },
  ],
};
