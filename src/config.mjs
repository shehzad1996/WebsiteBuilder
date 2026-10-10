// Shop facts. Everything in [SQUARE BRACKETS] is a placeholder: replace it with the
// real value before going live. Numbers left as strings (e.g. '[X]') are shown as-is
// and the cart will say "calculated at checkout" until a real number is entered.

export const site = {
  name: '[SHOP NAME]',
  legalName: '[REGISTERED COMPANY NAME] Ltd',
  city: '[CITY]',
  url: 'https://www.example.co.uk', // [PLACEHOLDER] live domain, no trailing slash

  // One accent colour. Must pass 4.5:1 contrast with white text.
  accent: '#C8102E',
  accentDark: '#A00D25',

  email: '[shop@yourdomain.co.uk]',
  phone: '[01234 567890]',
  phoneHref: '+441234567890', // [PLACEHOLDER] used in tel: links

  address: {
    line1: '[Unit / street address]',
    line2: '[Area]',
    city: '[CITY]',
    postcode: '[POSTCODE]',
    country: 'United Kingdom',
  },
  // Used for the embedded Google map. Put the full address or business name here.
  mapQuery: '[SHOP NAME], [street address], [CITY] [POSTCODE]',
  parking: '[PLACEHOLDER: parking and public transport details]',

  hours: [
    ['Monday', '[10:00 – 18:00]'],
    ['Tuesday', '[10:00 – 18:00]'],
    ['Wednesday', '[10:00 – 18:00]'],
    ['Thursday', '[10:00 – 20:00]'],
    ['Friday', '[10:00 – 18:00]'],
    ['Saturday', '[09:00 – 17:00]'],
    ['Sunday', '[Closed]'],
  ],

  companyNumber: '[00000000]',
  companyRegisteredIn: 'England and Wales',
  registeredOffice: '[Registered office address]',
  vatNumber: 'GB [000 0000 00]',

  // Delivery and returns. Shown on every product page, the cart and the policy pages.
  freeDeliveryThreshold: '[X]', // number, e.g. 50
  standardDeliveryCost: '[X.XX]', // number, e.g. 3.95
  standardDeliveryTime: '[2–3] working days',
  expressDeliveryCost: '[X.XX]',
  expressDeliveryTime: 'next working day if ordered before [1pm]',
  dispatchCutoff: '[2pm]',
  dispatchText: 'Orders placed before [2pm] Monday to Friday are dispatched the same day',
  courier: '[Royal Mail / DPD]',
  returnsDays: '[30]',
  clickAndCollect: 'Free click and collect from our [CITY] shop, usually ready within [2] hours',

  // Restringing
  restringFrom: '[X]', // labour price, e.g. 12
  restringTurnaround: 'Same day if handed in before [12 noon]',
  stringingAddonPrice: '[X]', // price to string a new racket bought online

  // Integrations. Leave empty until connected.
  trustpilotBusinessUnitId: '', // e.g. '5f1a...'; reviews section stays empty until set
  trustpilotDomain: '[yourdomain.co.uk]',
  googlePlaceId: '',
  formEndpoint: '', // e.g. a Formspree / Netlify / own endpoint for contact, trade and newsletter forms
  checkoutUrl: '', // Shopify / Stripe checkout once connected

  social: [
    // ['Instagram', 'https://instagram.com/...'],
  ],

  payments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'PayPal'], // [PLACEHOLDER] confirm accepted methods
};

export const money = (n) =>
  typeof n === 'number' ? `£${n.toFixed(2).replace(/\.00$/, '')}` : `£${n}`;
export const money2 = (n) => (typeof n === 'number' ? `£${n.toFixed(2)}` : `£${n}`);

export const addressLines = () =>
  [site.address.line1, site.address.line2, `${site.address.city} ${site.address.postcode}`].filter(Boolean);
