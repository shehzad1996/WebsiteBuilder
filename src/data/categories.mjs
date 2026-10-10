// Product categories and the mega menu. Each shop menu splits three ways:
// by brand, by type, by player level. Links use query strings that the
// collection page filter reads (e.g. /rackets/?brand=yonex).

export const levels = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const categories = [
  {
    id: 'rackets',
    label: 'Rackets',
    path: '/rackets/',
    title: 'Badminton Rackets',
    intro:
      'Rackets from Yonex, Victor and Li-Ning. Every racket can be strung in our workshop before dispatch, with your choice of string and tension.',
    seoDescription:
      'Badminton rackets from Yonex, Victor and Li-Ning. Filter by weight, balance and level. Strung to your tension before dispatch.',
    types: ['Adult', 'Junior'],
    // "By type" in the menu: balance links plus junior.
    menuTypes: [
      ['Head heavy (power)', '/rackets/?balance=head-heavy'],
      ['Even balance (all-round)', '/rackets/?balance=even-balance'],
      ['Head light (speed)', '/rackets/?balance=head-light'],
      ['Junior rackets', '/rackets/?type=junior'],
    ],
    photo: 'Rackets category: three rackets laid flat on a grey surface',
  },
  {
    id: 'shoes',
    label: 'Shoes',
    path: '/shoes/',
    title: 'Badminton Shoes',
    intro:
      'Court shoes with gum rubber soles for sprung wooden and synthetic floors. Try them on in the shop, or order online and return unworn pairs.',
    seoDescription:
      'Badminton and indoor court shoes from Yonex and Victor. UK sizes, non-marking soles, free returns on unworn pairs.',
    types: ['Standard fit', 'Wide fit', 'Junior'],
    photo: 'Shoes category: one court shoe, side profile',
  },
  {
    id: 'bags',
    label: 'Bags',
    path: '/bags/',
    title: 'Badminton Bags',
    intro: 'Racket bags with thermal compartments, backpacks with racket sleeves and shoe pockets.',
    seoDescription: 'Badminton racket bags and backpacks from Yonex, Victor and Li-Ning.',
    types: ['Racket bags', 'Backpacks'],
    photo: 'Bags category: 9-racket bag standing upright',
  },
  {
    id: 'shuttles',
    label: 'Shuttles',
    path: '/shuttles/',
    title: 'Badminton Shuttlecocks',
    intro:
      'Feather and nylon shuttles by the tube. Feather shuttles are sold by speed: pick a speed to suit the temperature of your hall.',
    seoDescription:
      'Feather and nylon badminton shuttlecocks by the tube and by the dozen tubes. Yonex Aerosensa, Mavis and Victor.',
    types: ['Feather', 'Nylon'],
    photo: 'Shuttles category: open tube of feather shuttles',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    path: '/clothing/',
    title: 'Badminton Clothing',
    intro: 'Shirts, shorts, skorts, socks and tracksuits for training and matches.',
    seoDescription: 'Badminton shirts, shorts, skorts, socks and tracksuits. Club teamwear available.',
    types: ['Shirts', 'Shorts & skorts', 'Jackets', 'Socks'],
    photo: 'Clothing category: folded playing shirt and shorts',
  },
  {
    id: 'strings-accessories',
    label: 'Strings & Accessories',
    path: '/strings-accessories/',
    title: 'Strings, Grips & Accessories',
    intro:
      'String sets and reels, overgrips, towel grips and court accessories. Strings bought here can be fitted in our workshop.',
    seoDescription: 'Badminton strings, reels, overgrips and towel grips from Yonex and Ashaway.',
    types: ['Strings', 'String reels', 'Grips'],
    photo: 'Strings category: string sets and overgrips on a bench',
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

// Non-shop menus. Same three-column structure, adapted to what they contain.
export const serviceMenu = {
  id: 'services',
  label: 'Services',
  path: '/services/',
  columns: [
    {
      heading: 'Workshop',
      links: [
        ['Restringing', '/restringing/'],
        ['String and tension advice', '/guides/string-tension/'],
        ['Grip replacement', '/restringing/#grips'],
      ],
    },
    {
      heading: 'Clubs and coaches',
      links: [
        ['Teamwear', '/teamwear/'],
        ['Trade accounts', '/trade-accounts/'],
        ['Shuttles in bulk', '/shuttles/'],
      ],
    },
    {
      heading: 'In store',
      links: [
        ['Visit our store', '/visit-our-store/'],
        ['Racket demo', '/visit-our-store/#demo'],
        ['Click and collect', '/delivery/#collect'],
      ],
    },
  ],
};

export const guideMenu = {
  id: 'guides',
  label: 'Guides',
  path: '/guides/',
  columns: [
    {
      heading: 'By product',
      links: [
        ['Choosing a racket', '/guides/choosing-a-racket/'],
        ['String tension', '/guides/string-tension/'],
        ['Shuttle speeds', '/guides/shuttle-speeds/'],
        ['Shoe sizing', '/guides/shoe-sizing/'],
      ],
    },
    {
      heading: 'By topic',
      links: [
        ['Racket weight and grip codes', '/guides/choosing-a-racket/#codes'],
        ['Feather or nylon', '/guides/shuttle-speeds/#feather-nylon'],
        ['When to restring', '/guides/string-tension/#when'],
      ],
    },
    {
      heading: 'By player level',
      links: [
        ['Racket Finder quiz', '/racket-finder/'],
        ['Beginner rackets', '/rackets/?level=beginner'],
        ['Intermediate rackets', '/rackets/?level=intermediate'],
        ['Advanced rackets', '/rackets/?level=advanced'],
      ],
    },
  ],
};
