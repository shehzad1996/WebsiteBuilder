import {
  esc, slugify, photo, productPhotoBase, findImage, productCard, productGrid, sectionHead, breadcrumbs,
  deliveryList, mapEmbed, hoursTable, reviewsSection, formAttrs, stockInfo,
  site, money, categories, levels, products, brands,
} from './lib/html.mjs';
import { addressLines } from './config.mjs';
import { categoryById } from './data/categories.mjs';
import { totalStock } from './data/products.mjs';
import { guides, posts, faqs } from './data/content.mjs';

const byNew = (a, b) => b.added.localeCompare(a.added);
const byBest = (a, b) => (a.best ?? 999) - (b.best ?? 999);
const fmtDate = (d) =>
  new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const storeLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'SportingGoodsStore',
  name: site.name,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  vatID: site.vatNumber,
  address: {
    '@type': 'PostalAddress',
    streetAddress: [site.address.line1, site.address.line2].filter(Boolean).join(', '),
    addressLocality: site.address.city,
    postalCode: site.address.postcode,
    addressCountry: 'GB',
  },
  openingHours: site.hours.map(([d, h]) => `${d.slice(0, 2)} ${h}`),
});

const pageHead = (title, intro) =>
  `<div class="page-head"><h1>${esc(title)}</h1>${intro ? `<p>${intro}</p>` : ''}</div>`;

const withCrumbs = (items) => breadcrumbs([['Home', '/'], ...items]);

// =====================================================================
// Home
// =====================================================================
function home() {
  const newIn = [...products].sort(byNew).slice(0, 10);
  const best = products.filter((p) => p.best).sort(byBest).slice(0, 10);
  const tiles = categories
    .map(
      (c) => `<a class="tile" href="${c.path}">${photo(`categories/${c.id}`, c.photo, { ratio: '4 / 5' })}<span class="tile-label">${esc(
        c.label
      )}<span aria-hidden="true">&rarr;</span></span></a>`
    )
    .join('');
  const brandRow = brands
    .map(
      (b) =>
        `<li><a href="/search/?q=${encodeURIComponent(b)}">${photo(`brands/${slugify(b)}`, `${b} logo`, {
          ratio: '3 / 1',
          alt: b,
        })}</a></li>`
    )
    .join('');
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const body = `
<section class="hero">
  ${photo('home/hero', 'Hero: wide shot of the shop interior or a player mid-smash, landscape, at least 2400px wide', { eager: true, ratio: '16 / 9' })}
  <div class="hero-text"><div class="wrap">
    <h1>Same-day restringing in ${esc(site.city)}</h1>
    <a class="btn btn-accent" href="/restringing/">Book a restring</a>
  </div></div>
</section>

<div class="wrap"><div class="usp">
  <div><strong>Free UK delivery</strong>On orders over ${money(site.freeDeliveryThreshold)}</div>
  <div><strong>Dispatched today</strong>Order before ${esc(site.dispatchCutoff)}, Mon–Fri</div>
  <div><strong>${esc(site.returnsDays)}-day returns</strong>On unused items</div>
  <div><strong>Shop in ${esc(site.city)}</strong><a href="/visit-our-store/">Address and opening hours</a></div>
</div></div>

<section class="sec"><div class="wrap">
  ${sectionHead('Shop by category')}
  <div class="tiles">${tiles}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead('New arrivals', ['View all', '/new-arrivals/'])}
  ${productGrid(newIn, 'grid-wide')}
</div></section>

<section class="sec"><div class="wrap">
  <div class="finder">
    <div class="finder-text">
      <p class="label">Racket Finder</p>
      <h2>Not sure which racket? Answer five questions.</h2>
      <p>Tell us how you play and we will suggest a weight, balance and shaft flex, and the rackets in stock that match.</p>
      <a class="btn" href="/racket-finder/">Start the Racket Finder</a>
    </div>
    ${photo('home/racket-finder', 'Racket Finder banner: close-up of several racket heads on the shop wall', { ratio: '16 / 9' })}
  </div>
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead('Best sellers', ['View all', '/best-sellers/'])}
  ${productGrid(best, 'grid-wide')}
</div></section>

<section class="sec"><div class="wrap">
  ${sectionHead('Brands we stock')}
  <ul class="brands">${brandRow}</ul>
</div></section>

${reviewsSection()}

<section class="sec"><div class="wrap">
  ${sectionHead('From the blog', ['All posts', '/blog/'])}
  <div class="posts">${latest.map(postCard).join('')}</div>
</div></section>

${newsletter()}`;

  return {
    path: '/',
    title: `${site.name} | Badminton Rackets, Shoes and Restringing in ${site.city}`,
    description: `Badminton specialist in ${site.city}. Rackets, shoes, shuttles and strings from Yonex, Victor and Li-Ning. Same-day restringing. Free UK delivery over ${money(
      site.freeDeliveryThreshold
    )}.`,
    body,
    jsonLd: [storeLd()],
  };
}

function postCard(p) {
  return `<article class="post-card"><a href="/blog/${p.slug}/">${photo(`blog/${p.slug}`, p.photo, { ratio: '16 / 10' })}
  <p class="post-date">${fmtDate(p.date)}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></a></article>`;
}

function newsletter() {
  return `<section class="news" aria-labelledby="news-h"><div class="wrap">
  <div><h2 id="news-h">Newsletter</h2><p>New stock, restocks of popular sizes, and shop opening changes. About once a month. Unsubscribe any time.</p></div>
  <form ${formAttrs('newsletter')} class="js-form">
    <input type="hidden" name="form" value="newsletter">
    <label class="vh" for="news-email">Email address</label>
    <input id="news-email" type="email" name="email" required placeholder="Email address" autocomplete="email">
    <button class="btn btn-accent" type="submit">Sign up</button>
  </form>
</div></section>`;
}

// =====================================================================
// Collections
// =====================================================================
function filterGroup(legend, name, values, counts) {
  if (values.length < 2) return '';
  return `<fieldset class="fgroup"><legend>${legend}</legend>${values
    .map(
      ([val, label]) =>
        `<label class="check"><input type="checkbox" name="${name}" value="${esc(val)}"> ${esc(label)}<span class="n">${
          counts[val] ?? 0
        }</span></label>`
    )
    .join('')}</fieldset>`;
}

function collectionPage({ path, title, intro, seoDescription, list, crumbs, showCategory = false, defaultSort = 'featured' }) {
  const count = (fn) => list.reduce((m, p) => [].concat(fn(p)).filter(Boolean).reduce((mm, v) => ((mm[v] = (mm[v] || 0) + 1), mm), m), {});
  const bCounts = count((p) => slugify(p.brand));
  const tCounts = count((p) => slugify(p.type || ''));
  const lCounts = count((p) => p.level);
  const wCounts = count((p) => p.weight);
  const balCounts = count((p) => (p.balance ? slugify(p.balance) : null));
  const cCounts = count((p) => p.category);
  const uniq = (arr) => [...new Set(arr)];
  const prices = list.map((p) => p.price);

  const groups = [
    showCategory
      ? filterGroup('Category', 'cat', categories.filter((c) => cCounts[c.id]).map((c) => [c.id, c.label]), cCounts)
      : '',
    filterGroup('Brand', 'brand', uniq(list.map((p) => p.brand)).sort().map((b) => [slugify(b), b]), bCounts),
    showCategory ? '' : filterGroup('Type', 'type', uniq(list.map((p) => p.type)).filter(Boolean).map((t) => [slugify(t), t]), tCounts),
    `<fieldset class="fgroup"><legend>Price</legend><div class="price-range">
      <label class="vh" for="pmin">Minimum price</label><input id="pmin" type="number" inputmode="numeric" min="0" name="min" placeholder="£${Math.floor(Math.min(...prices))}">
      <span>to</span>
      <label class="vh" for="pmax">Maximum price</label><input id="pmax" type="number" inputmode="numeric" min="0" name="max" placeholder="£${Math.ceil(Math.max(...prices))}">
    </div></fieldset>`,
    filterGroup('Weight', 'weight', ['2U', '3U', '4U', '5U'].filter((w) => wCounts[w]).map((w) => [w, w]), wCounts),
    filterGroup(
      'Balance',
      'balance',
      ['Head heavy', 'Even balance', 'Head light'].filter((b) => balCounts[slugify(b)]).map((b) => [slugify(b), b]),
      balCounts
    ),
    filterGroup('Level', 'level', levels.filter((l) => lCounts[l.id]).map((l) => [l.id, l.label]), lCounts),
    `<label class="check"><input type="checkbox" name="stock" value="1"> In stock only</label>`,
  ].join('');

  const cr = withCrumbs(crumbs);
  const body = `<div class="wrap">
${cr.html}
${pageHead(title, intro)}
<div class="coll" data-collection data-default-sort="${defaultSort}">
  <form class="filters" id="filters" aria-label="Filter products">
    <div class="filters-head"><span class="label">Filter</span><button type="button" class="icon-btn js-filters-close"><span aria-hidden="true">&times;</span><span class="vh">Close filters</span></button></div>
    ${groups}
    <p><button type="reset" class="link-btn">Clear all filters</button></p>
    <div class="filters-apply"><button type="button" class="btn btn-block js-filters-close">Show <span data-count>${list.length}</span> products</button></div>
  </form>
  <div>
    <div class="toolbar">
      <span class="count" aria-live="polite"><span data-count>${list.length}</span> products</span>
      <div class="toolbar-r">
        <button type="button" class="btn btn-line filter-btn js-filters-open" aria-controls="filters">Filter</button>
        <label class="vh" for="sort">Sort by</label>
        <select id="sort" name="sort" form="filters">
          <option value="featured">Sort: Featured</option>
          <option value="best">Best sellers</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
    <div class="active-filters" data-active></div>
    ${productGrid(list)}
    <p class="empty" data-empty hidden>No products match those filters. <button type="button" class="link-btn js-clear">Clear filters</button></p>
  </div>
</div>
</div>`;
  return {
    path,
    title,
    description: seoDescription,
    body,
    jsonLd: [cr.ld],
  };
}

function categoryPages() {
  return categories.map((c) =>
    collectionPage({
      path: c.path,
      title: c.title,
      intro: esc(c.intro),
      seoDescription: c.seoDescription,
      list: products.filter((p) => p.category === c.id),
      crumbs: [[c.label, c.path]],
    })
  );
}

// =====================================================================
// Product pages
// =====================================================================
function productPage(p) {
  const cat = categoryById[p.category];
  const cr = withCrumbs([[cat.label, cat.path], [p.name, `/products/${p.slug}/`]]);
  const n = totalStock(p);

  // Gallery: up to 5 images. Placeholders describe the shot needed.
  const shots = p.category === 'rackets'
    ? ['Full racket, front, on white', 'Racket head close-up', 'Shaft and T-joint', 'Handle and butt cap', 'Racket in cover']
    : p.category === 'shoes'
    ? ['Side profile, outer', 'Top down', 'Sole', 'Heel', 'Pair on court']
    : ['Front, on white', 'Detail', 'Alternative angle'];
  const imgs = shots.map((label, i) => {
    const base = productPhotoBase(p, i + 1);
    return { base, label: `${p.name}: ${label}`, has: !!findImage(base) };
  });
  const gallery = `<div class="gallery" data-gallery>
  <div class="gallery-main">${imgs
    .map((im, i) => photo(im.base, im.label, { eager: i === 0, cls: i === 0 ? 'active' : '' }).replace(/^<(img|div)/, `<$1 data-idx="${i}"`))
    .join('')}</div>
  <ul class="thumbs">${imgs
    .map(
      (im, i) =>
        `<li><button type="button" aria-pressed="${i === 0}" data-show="${i}"><span class="vh">Show image ${i + 1}</span>${photo(
          im.base,
          im.label.split(': ')[1],
          { alt: '' }
        )}</button></li>`
    )
    .join('')}</ul>
</div>`;

  const firstAvail = p.options.values.findIndex((v) => v.stock > 0);
  const chips = `<fieldset class="chips" data-variants><legend>${esc(p.options.name)}</legend>${p.options.values
    .map(
      (v, i) =>
        `<label class="chip"><input type="radio" name="variant" value="${esc(v.value)}" data-stock="${v.stock}" ${
          v.stock <= 0 ? 'disabled' : ''
        } ${i === firstAvail ? 'checked' : ''} required><span>${esc(v.value)}</span></label>`
    )
    .join('')}</fieldset>`;
  const s = stockInfo(firstAvail >= 0 ? p.options.values[firstAvail].stock : 0);

  const stringing =
    p.category === 'rackets' && !p.supplied
      ? `<div class="stringing">
  <p class="label">Stringing</p>
  <div class="form-grid">
    <div class="field"><label for="string">String</label><select id="string" name="string">
      <option value="">Unstrung</option>
      ${['Yonex BG65', 'Yonex BG80', 'Yonex Exbolt 63', 'Yonex Exbolt 65', 'Yonex Aerobite', 'Ashaway ZyMax 66 Fire'].map((x) => `<option>${x}</option>`).join('')}
    </select></div>
    <div class="field"><label for="tension">Tension</label><select id="tension" name="tension">
      ${Array.from({ length: 13 }, (_, i) => 18 + i).map((t) => `<option ${t === 24 ? 'selected' : ''}>${t} lbs</option>`).join('')}
    </select></div>
  </div>
  <p class="form-note" style="margin:0">Strung in our workshop before dispatch: ${money(site.stringingAddonPrice)} including string. Adds [1] working day. A strung racket can only be returned if faulty.</p>
</div>`
      : '';

  const related = products
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .map((x) => ({ x, score: (x.brand === p.brand ? 1 : 0) + x.level.filter((l) => p.level.includes(l)).length + (x.balance && x.balance === p.balance ? 2 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.x);

  const body = `<div class="wrap">
${cr.html}
<div class="pdp">
  ${gallery}
  <div class="pdp-info">
    <p class="label">${esc(p.brand)} · ${esc(cat.label)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="muted" style="margin:0">Level: ${p.level.map((l) => levels.find((x) => x.id === l).label).join(', ')}</p>
    <p class="pdp-price">${p.was ? `<s class="muted">${money(p.was)}</s> ` : ''}${money(p.price)}</p>
    <p class="vat">Including VAT</p>
    <form class="pdp-form" data-add-form
      data-slug="${p.slug}" data-name="${esc(p.name)}" data-price="${p.price}" data-addon="${esc(site.stringingAddonPrice)}"
      data-img="${esc(findImage(productPhotoBase(p)) || '')}">
      ${chips}
      <p class="pdp-stock stock stock-${s.cls}" data-stock-text aria-live="polite">${n > 0 ? s.text : 'Out of stock'}</p>
      ${stringing}
      <div class="buy">
        <label class="vh" for="qty">Quantity</label>
        <select id="qty" class="qty" name="qty">${[1, 2, 3, 4, 5, 6, 8, 10, 12].map((q) => `<option>${q}</option>`).join('')}</select>
        <button class="btn btn-accent" type="submit" ${n <= 0 ? 'disabled' : ''}>${n > 0 ? 'Add to basket' : 'Out of stock'}</button>
      </div>
      <div class="added-msg" data-added hidden role="status"></div>
    </form>
    <div class="box">
      <h2 class="label" style="font-size:12px;color:var(--ink)">Delivery and returns</h2>
      ${deliveryList()}
    </div>
  </div>
</div>

<div class="cols-2 sec" style="padding-top:8px">
  <section>
    ${sectionHead('About this ' + (p.category === 'rackets' ? 'racket' : 'product'))}
    <div class="pdp-desc"><p>${esc(p.desc)}</p></div>
    ${
      p.category === 'rackets'
        ? `<p class="note">Want to try it first? We keep demo rackets in the <a href="/visit-our-store/">${esc(site.city)} shop</a>. Unsure about weight or balance? Read <a href="/guides/choosing-a-racket/">choosing a racket</a>.</p>`
        : p.category === 'shoes'
        ? `<p class="note">Sizing: see our <a href="/guides/shoe-sizing/">shoe sizing guide</a>, or try them on in the shop.</p>`
        : ''
    }
  </section>
  <section>
    ${sectionHead('Specification')}
    <table class="spec"><tbody>
      <tr><th scope="row">Brand</th><td>${esc(p.brand)}</td></tr>
      ${p.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
      <tr><th scope="row">Product code</th><td>[SKU]</td></tr>
    </tbody></table>
  </section>
</div>

<section class="sec"><div>
  ${sectionHead('Related products', ['View all', cat.path])}
  ${productGrid(related, 'grid-wide')}
</div></section>
</div>`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    brand: { '@type': 'Brand', name: p.brand },
    description: p.desc,
    category: cat.title,
    url: `${site.url}/products/${p.slug}/`,
    ...(findImage(productPhotoBase(p)) ? { image: site.url + findImage(productPhotoBase(p)) } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: p.price.toFixed(2),
      availability: n > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${site.url}/products/${p.slug}/`,
    },
  };

  return {
    path: `/products/${p.slug}/`,
    title: `${p.name} | ${cat.title}`,
    description: `${p.name}. ${p.desc} ${money(p.price)}, dispatched same day before ${site.dispatchCutoff}.`.slice(0, 300),
    body,
    jsonLd: [ld, cr.ld],
  };
}

// =====================================================================
// Racket Finder
// =====================================================================
function racketFinder() {
  const q = (name, legend, opts) => `<fieldset><legend>${legend}</legend><div class="opts">${opts
    .map(([v, l]) => `<label class="opt"><input type="radio" name="${name}" value="${v}" required><span>${l}</span></label>`)
    .join('')}</div></fieldset>`;
  const cr = withCrumbs([['Racket Finder', '/racket-finder/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead('Racket Finder', 'Five questions. We suggest a weight, balance and shaft flex, then show the rackets in stock that match. It is a starting point: you are welcome to try demo rackets in the shop.')}
<div class="cols-2">
<form class="quiz" id="quiz">
  ${q('level', '1. How long have you played?', [
    ['beginner', 'Just started, or play casually a few times a year'],
    ['intermediate', 'Play regularly at a club'],
    ['advanced', 'Play league, county or tournaments'],
    ['returning', 'Coming back after a long break'],
  ])}
  ${q('game', '2. What do you play most?', [
    ['singles', 'Singles'],
    ['back', 'Doubles, mostly at the back'],
    ['front', 'Doubles, mostly at the front'],
    ['mixed', 'A mix of everything'],
  ])}
  ${q('swing', '3. How would you describe your swing?', [
    ['slow', 'Still working on it. Hard to reach the back line.'],
    ['medium', 'Reasonably quick. I can clear to the back most of the time.'],
    ['fast', 'Fast and well timed'],
  ])}
  ${q('want', '4. What do you want more of?', [
    ['power', 'Power on smashes and clears'],
    ['speed', 'Speed in defence and drives'],
    ['control', 'Control and placement'],
  ])}
  ${q('budget', '5. Budget', [
    ['75', 'Under £75'],
    ['160', '£75 to £160'],
    ['999', 'Over £160'],
  ])}
  <button class="btn btn-accent" type="submit">Show my rackets</button>
  <noscript><p class="note">The Racket Finder needs JavaScript. You can also browse <a href="/rackets/">all rackets</a> and filter by weight, balance and level.</p></noscript>
</form>
<aside>
  <div class="box"><h2>What the answers change</h2>
  <ul class="facts">
    <li><strong>Experience</strong>Sets the level and how stiff a shaft we suggest.</li>
    <li><strong>Position</strong>Back-court and singles players usually suit head-heavy frames. Front-court players usually suit head-light.</li>
    <li><strong>Swing</strong>A slower swing gets more help from a flexible shaft.</li>
    <li><strong>Budget</strong>Only shows rackets in your price range.</li>
  </ul>
  <p style="margin:10px 0 0"><a href="/guides/choosing-a-racket/">Read the full guide to choosing a racket</a></p></div>
</aside>
</div>
<div id="quiz-result" aria-live="polite"></div>
</div>`;
  return {
    path: '/racket-finder/',
    title: 'Racket Finder: Which Badminton Racket Should I Buy?',
    description: 'Answer five questions about how you play and we suggest a racket weight, balance and shaft flex, with matching rackets in stock.',
    body,
    jsonLd: [cr.ld],
  };
}

// =====================================================================
// Services
// =====================================================================
function services() {
  const cr = withCrumbs([['Services', '/services/']]);
  const card = (title, text, href, ph) =>
    `<a class="tile" href="${href}">${photo(ph[0], ph[1], { ratio: '16 / 10' })}<span class="tile-label">${title}<span aria-hidden="true">&rarr;</span></span><span style="display:block;padding:0 10px 12px;font-size:14px">${text}</span></a>`;
  const body = `<div class="wrap">${cr.html}
${pageHead('Services', `Workshop, club and in-store services from our ${esc(site.city)} shop.`)}
<div class="tiles" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
  ${card('Restringing', `${esc(site.restringTurnaround)}. From ${money(site.restringFrom)} labour.`, '/restringing/', ['services/restringing', 'Stringing machine in the workshop'])}
  ${card('Teamwear', 'Club shirts and jackets printed with your badge and names.', '/teamwear/', ['services/teamwear', 'Printed club shirts laid out'])}
  ${card('Club and coach accounts', 'Trade pricing on shuttles, strings and rackets.', '/trade-accounts/', ['services/trade', 'Boxes of shuttle tubes'])}
  ${card('Visit our store', 'Demo rackets, shoe fitting and stringing.', '/visit-our-store/', ['services/store', 'Shop front'])}
</div></div>`;
  return { path: '/services/', title: 'Services', description: `Restringing, teamwear, club trade accounts and in-store services at ${site.name}, ${site.city}.`, body, jsonLd: [cr.ld] };
}

function restringing() {
  const cr = withCrumbs([['Services', '/services/'], ['Restringing', '/restringing/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead(`Same-day restringing in ${esc(site.city)}`, `${esc(site.restringTurnaround)}. Every racket is strung on an electronic constant-pull machine [PLACEHOLDER: machine make/model] and checked before collection.`)}
<div class="cols-2">
<div>
  <section class="sec" style="padding-top:0">
    ${sectionHead('Prices')}
    <table class="spec price-table">
      <thead><tr><th>Service</th><th>Turnaround</th><th>Price</th></tr></thead>
      <tbody>
        <tr><td>Labour only (your string)</td><td>Same day</td><td>${money(site.restringFrom)}</td></tr>
        <tr><td>Yonex BG65, fitted</td><td>Same day</td><td>£[X]</td></tr>
        <tr><td>Yonex BG80, fitted</td><td>Same day</td><td>£[X]</td></tr>
        <tr><td>Yonex Exbolt 63 / 65, fitted</td><td>Same day</td><td>£[X]</td></tr>
        <tr><td>Yonex Aerobite, fitted</td><td>Same day</td><td>£[X]</td></tr>
        <tr><td>Express, while you wait</td><td>[1 hour]</td><td>+£[X]</td></tr>
        <tr><td id="grips">Grip replacement (replacement grip, fitted)</td><td>While you wait</td><td>£[X]</td></tr>
        <tr><td>Grommet replacement</td><td>Same day</td><td>£[X]</td></tr>
      </tbody>
    </table>
    <p class="form-note">Club and coach accounts get restringing at trade rates. <a href="/trade-accounts/">Apply here</a>.</p>
  </section>
  <section class="sec">
    ${sectionHead('How it works')}
    <ol class="steps">
      <li><strong>Hand it in</strong>Drop your racket at the shop during opening hours. No booking needed.</li>
      <li><strong>Choose</strong>Pick a string and tension. Not sure? We will ask how you play.</li>
      <li><strong>We string it</strong>${esc(site.restringTurnaround)}.</li>
      <li><strong>Collect</strong>We text you when it is ready. Pay on collection.</li>
    </ol>
  </section>
  <section class="sec">
    ${sectionHead('Posting your racket')}
    <p>Not local? Post your racket to us with a note of your name, phone number, string and tension. We restring it and send it back by tracked delivery for £[X]. Address: ${addressLines().map(esc).join(', ')}.</p>
  </section>
  <section class="sec">
    ${sectionHead('Book ahead')}
    <p>Booking is optional. It helps for tournaments or if you need a specific string we might be low on.</p>
    <form ${formAttrs('restring')} class="js-form">
      <input type="hidden" name="form" value="restring-booking">
      <div class="form-grid">
        <div class="field"><label for="r-name">Name</label><input id="r-name" name="name" type="text" required autocomplete="name"></div>
        <div class="field"><label for="r-phone">Mobile</label><input id="r-phone" name="phone" type="tel" required autocomplete="tel"></div>
        <div class="field"><label for="r-racket">Racket</label><input id="r-racket" name="racket" type="text" placeholder="e.g. Yonex Astrox 88D Pro 4U"></div>
        <div class="field"><label for="r-date">Drop-off date</label><input id="r-date" name="date" type="date"></div>
        <div class="field"><label for="r-string">String</label><select id="r-string" name="string"><option>Not sure, advise me</option><option>Yonex BG65</option><option>Yonex BG80</option><option>Yonex Exbolt 63</option><option>Yonex Exbolt 65</option><option>Yonex Aerobite</option><option>My own string</option></select></div>
        <div class="field"><label for="r-tension">Tension</label><select id="r-tension" name="tension"><option>Not sure, advise me</option>${Array.from({ length: 13 }, (_, i) => `<option>${18 + i} lbs</option>`).join('')}</select></div>
        <div class="field full"><label for="r-notes">Notes</label><textarea id="r-notes" name="notes"></textarea></div>
      </div>
      <button class="btn btn-accent" type="submit">Send booking</button>
    </form>
  </section>
</div>
<aside>
  <div class="box" style="margin-bottom:16px"><h2>Turnaround</h2><p style="margin:0">${esc(site.restringTurnaround)}. Later drop-offs are ready the next working day.</p></div>
  <div class="box" style="margin-bottom:16px"><h2>Which tension?</h2><p>Most club players use 21–24 lbs. Never above the maximum printed on your frame.</p><a href="/guides/string-tension/">String and tension guide</a></div>
  <div class="box"><h2>Shop</h2><address>${addressLines().map(esc).join('<br>')}<br><a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a></address><div style="margin-top:10px">${hoursTable()}</div></div>
</aside>
</div></div>`;
  return {
    path: '/restringing/',
    title: `Badminton Restringing in ${site.city}`,
    description: `Same-day badminton racket restringing in ${site.city}. ${site.restringTurnaround}. Labour from ${money(site.restringFrom)}. Yonex BG65, BG80, Exbolt and Aerobite.`,
    body,
    jsonLd: [cr.ld],
  };
}

function teamwear() {
  const cr = withCrumbs([['Services', '/services/'], ['Teamwear', '/teamwear/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead('Teamwear', 'Club shirts, jackets and shorts with your badge, sponsor and player names. For clubs, schools, universities and county squads.')}
<div class="cols-2"><div>
  ${photo('services/teamwear-hero', 'Teamwear: club team in matching printed shirts', { ratio: '16 / 9' })}
  <section class="sec">
    ${sectionHead('What we supply')}
    <table class="spec"><tbody>
      <tr><th scope="row">Garments</th><td>Playing shirts, polos, shorts, skorts, warm-up jackets and hoodies from [Yonex / Victor / own range]</td></tr>
      <tr><th scope="row">Decoration</th><td>[Heat-transfer print / embroidery] for badges; printed names and initials on the back</td></tr>
      <tr><th scope="row">Minimum order</th><td>[X] garments per design</td></tr>
      <tr><th scope="row">Lead time</th><td>[X–X] weeks from artwork sign-off</td></tr>
      <tr><th scope="row">Sizing</th><td>Size sample sets available to borrow</td></tr>
      <tr><th scope="row">Reorders</th><td>Members can be sent a link to order their own kit at any time [PLACEHOLDER: confirm]</td></tr>
    </tbody></table>
  </section>
  <section class="sec">
    ${sectionHead('How it works')}
    <ol class="steps">
      <li><strong>Enquire</strong>Send the form with rough numbers and the garments you want.</li>
      <li><strong>Artwork</strong>Send your badge. We send back a proof and a quote.</li>
      <li><strong>Sizes</strong>Collect sizes from your members. Borrow our sample sets if useful.</li>
      <li><strong>Delivery</strong>Collect from the shop or we deliver to the club.</li>
    </ol>
  </section>
</div>
<aside>
  <div class="box"><h2>Teamwear enquiry</h2>
  <form ${formAttrs('teamwear')} class="js-form">
    <input type="hidden" name="form" value="teamwear">
    <div class="field"><label for="t-club">Club or school</label><input id="t-club" name="club" type="text" required></div>
    <div class="field"><label for="t-name">Your name</label><input id="t-name" name="name" type="text" required autocomplete="name"></div>
    <div class="field"><label for="t-email">Email</label><input id="t-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="t-phone">Phone</label><input id="t-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field"><label for="t-qty">Approximate number of players</label><input id="t-qty" name="quantity" type="number" min="1"></div>
    <div class="field"><label for="t-msg">What do you need?</label><textarea id="t-msg" name="message" placeholder="Garments, colours, deadline"></textarea></div>
    <button class="btn btn-accent btn-block" type="submit">Send enquiry</button>
  </form></div>
</aside></div></div>`;
  return { path: '/teamwear/', title: 'Badminton Teamwear for Clubs and Schools', description: `Printed badminton club shirts, jackets and shorts from ${site.name}, ${site.city}. Badges, names and sponsors.`, body, jsonLd: [cr.ld] };
}

function trade() {
  const cr = withCrumbs([['Services', '/services/'], ['Club and coach trade accounts', '/trade-accounts/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead('Club and coach trade accounts', 'Trade pricing for badminton clubs, coaches, schools, universities and leisure centres.')}
<div class="cols-2"><div>
  <section class="sec" style="padding-top:0">
    ${sectionHead('What you get')}
    <table class="spec"><tbody>
      <tr><th scope="row">Shuttles</th><td>Trade price per tube on dozen-tube boxes of feather and nylon shuttles</td></tr>
      <tr><th scope="row">Restringing</th><td>Trade rate for club members and coaching groups</td></tr>
      <tr><th scope="row">Rackets and shoes</th><td>[X]% off RRP for coaches and club equipment [PLACEHOLDER: confirm terms]</td></tr>
      <tr><th scope="row">Payment terms</th><td>[30-day invoice terms for approved accounts]</td></tr>
      <tr><th scope="row">Delivery</th><td>Free delivery on trade orders over £[X], or collect from the shop</td></tr>
      <tr><th scope="row">Teamwear</th><td>Printed club kit. See <a href="/teamwear/">Teamwear</a>.</td></tr>
    </tbody></table>
  </section>
  <section class="sec">
    ${sectionHead('Who can apply')}
    <ul>
      <li>Badminton clubs affiliated to [Badminton England / Scotland / Wales / Ireland] or a county association</li>
      <li>Qualified coaches (please include your coaching licence number)</li>
      <li>Schools, colleges and universities</li>
      <li>Leisure centres and sports halls</li>
    </ul>
    <p>We aim to reply within [2] working days.</p>
  </section>
</div>
<aside><div class="box"><h2>Apply for an account</h2>
  <form ${formAttrs('trade')} class="js-form">
    <input type="hidden" name="form" value="trade-account">
    <div class="field"><label for="a-org">Club, school or organisation</label><input id="a-org" name="organisation" type="text" required></div>
    <div class="field"><label for="a-type">Type</label><select id="a-type" name="type"><option>Club</option><option>Coach</option><option>School / college / university</option><option>Leisure centre</option><option>Other</option></select></div>
    <div class="field"><label for="a-name">Contact name</label><input id="a-name" name="name" type="text" required autocomplete="name"></div>
    <div class="field"><label for="a-email">Email</label><input id="a-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="a-phone">Phone</label><input id="a-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field"><label for="a-ref">Affiliation or coaching licence number</label><input id="a-ref" name="reference" type="text"></div>
    <div class="field"><label for="a-msg">What do you usually buy?</label><textarea id="a-msg" name="message" placeholder="e.g. 20 tubes of AS-30 a month"></textarea></div>
    <button class="btn btn-accent btn-block" type="submit">Apply</button>
  </form></div></aside>
</div></div>`;
  return { path: '/trade-accounts/', title: 'Club and Coach Trade Accounts', description: `Trade pricing on shuttles, strings, restringing and rackets for badminton clubs, coaches and schools. ${site.name}, ${site.city}.`, body, jsonLd: [cr.ld] };
}

function visit() {
  const cr = withCrumbs([['Visit our store', '/visit-our-store/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead(`Visit our ${esc(site.city)} shop`, 'Rackets, shoes, shuttles and clothing in stock, with a stringing workshop on site.')}
<div class="cols-2">
  <div>
    ${mapEmbed()}
    <div class="form-grid" style="margin-top:20px">
      ${photo('store/front', 'Store: shop front from the street', { ratio: '4 / 3' })}
      ${photo('store/inside', 'Store: racket wall inside the shop', { ratio: '4 / 3' })}
    </div>
  </div>
  <aside>
    <div class="box" style="margin-bottom:16px">
      <h2>Address</h2>
      <address>${addressLines().map(esc).join('<br>')}</address>
      <p style="margin:10px 0 0"><a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
    </div>
    <div class="box" style="margin-bottom:16px"><h2>Opening hours</h2>${hoursTable()}<p class="form-note" style="margin:8px 0 0">Bank holiday hours: [PLACEHOLDER]</p></div>
    <div class="box"><h2>Getting here</h2><p style="margin:0">${esc(site.parking)}</p></div>
  </aside>
</div>
<section class="sec" id="demo" style="padding-top:28px">
  ${sectionHead('In the shop')}
  <table class="spec"><tbody>
    <tr><th scope="row">Demo rackets</th><td>Try rackets before you buy. [PLACEHOLDER: say whether you have a hitting area or let customers borrow demos.]</td></tr>
    <tr><th scope="row">Shoe fitting</th><td>Try on any shoe in stock, including wide fits.</td></tr>
    <tr><th scope="row">Restringing</th><td>${esc(site.restringTurnaround)}. <a href="/restringing/">Prices</a></td></tr>
    <tr><th scope="row">Click and collect</th><td>${esc(site.clickAndCollect)}.</td></tr>
  </tbody></table>
</section>
</div>
${reviewsSection({ heading: 'Reviews' })}`;
  return {
    path: '/visit-our-store/',
    title: `Badminton Shop in ${site.city}: Address and Opening Hours`,
    description: `Visit ${site.name}, a badminton shop in ${site.city}. ${addressLines().join(', ')}. Opening hours, map and parking.`,
    body,
    jsonLd: [storeLd(), cr.ld],
  };
}

// =====================================================================
// Guides & blog
// =====================================================================
function guidesIndex() {
  const cr = withCrumbs([['Buying guides', '/guides/']]);
  const body = `<div class="wrap">${cr.html}
${pageHead('Buying guides', 'Plain explanations of the specs on our product pages.')}
<div class="posts">${guides
    .map(
      (g) => `<article class="post-card"><a href="/guides/${g.slug}/">${photo(`guides/${g.slug}`, g.photo, { ratio: '16 / 10' })}<h3>${esc(
        g.title
      )}</h3><p>${esc(g.summary)}</p></a></article>`
    )
    .join('')}
  <article class="post-card"><a href="/racket-finder/">${photo('guides/racket-finder', 'Guide: Racket Finder', { ratio: '16 / 10' })}<h3>Racket Finder</h3><p>Five questions to narrow down a racket.</p></a></article>
</div></div>`;
  return { path: '/guides/', title: 'Badminton Buying Guides', description: 'Guides to badminton racket weight and balance, string tension, shuttle speeds and shoe sizing.', body, jsonLd: [cr.ld] };
}

function guidePage(g) {
  const cr = withCrumbs([['Buying guides', '/guides/'], [g.title, `/guides/${g.slug}/`]]);
  const body = `<div class="wrap">${cr.html}
<div class="cols-2"><article class="prose">${pageHead(g.title, esc(g.summary))}${g.body}</article>
<aside><div class="box"><h2>Other guides</h2><ul class="facts">${guides
    .filter((x) => x.slug !== g.slug)
    .map((x) => `<li><a href="/guides/${x.slug}/">${esc(x.title)}</a></li>`)
    .join('')}</ul></div></aside></div></div>`;
  return {
    path: `/guides/${g.slug}/`,
    title: g.title,
    description: g.summary,
    body,
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.summary, publisher: { '@type': 'Organization', name: site.name } }, cr.ld],
  };
}

function blogIndex() {
  const cr = withCrumbs([['Blog', '/blog/']]);
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const body = `<div class="wrap">${cr.html}${pageHead('Blog', 'News from the shop and workshop.')}<div class="posts">${list.map(postCard).join('')}</div></div>${newsletter()}`;
  return { path: '/blog/', title: 'Blog', description: `News, stock updates and advice from ${site.name} in ${site.city}.`, body, jsonLd: [cr.ld], noFooterGap: true };
}

function postPage(p) {
  const cr = withCrumbs([['Blog', '/blog/'], [p.title, `/blog/${p.slug}/`]]);
  const body = `<div class="wrap">${cr.html}<article class="prose">
<p class="label">${fmtDate(p.date)}</p><h1>${esc(p.title)}</h1>
${photo(`blog/${p.slug}`, p.photo, { ratio: '16 / 9', eager: true })}
<div style="margin-top:20px">${p.body}</div></article></div>`;
  return {
    path: `/blog/${p.slug}/`,
    title: p.title,
    description: p.summary,
    body,
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.date, description: p.summary, publisher: { '@type': 'Organization', name: site.name } }, cr.ld],
  };
}

// =====================================================================
// Help pages
// =====================================================================
function faqPage() {
  const cr = withCrumbs([['FAQ', '/faq/']]);
  const all = faqs.flatMap(([, qs]) => qs);
  const body = `<div class="wrap">${cr.html}${pageHead('Frequently asked questions', `Cannot find an answer? <a href="/contact/">Contact us</a> or call ${esc(site.phone)}.`)}
${faqs
  .map(
    ([h, qs]) => `<section class="sec" style="padding-top:0">${sectionHead(h)}${qs
      .map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`)
      .join('')}</section>`
  )
  .join('')}</div>`;
  return {
    path: '/faq/',
    title: 'FAQ: Delivery, Restringing and Returns',
    description: `Answers on delivery, dispatch times, restringing, tension and returns at ${site.name}.`,
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: all.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
      },
      cr.ld,
    ],
  };
}

function contact() {
  const cr = withCrumbs([['Contact', '/contact/']]);
  const body = `<div class="wrap">${cr.html}${pageHead('Contact us', `We reply to emails within [1] working day. For anything urgent, call during opening hours.`)}
<div class="cols-2">
  <div><form ${formAttrs('contact')} class="js-form">
    <input type="hidden" name="form" value="contact">
    <div class="form-grid">
      <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" type="text" required autocomplete="name"></div>
      <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="c-order">Order number (if you have one)</label><input id="c-order" name="order" type="text"></div>
      <div class="field"><label for="c-topic">Subject</label><select id="c-topic" name="topic"><option>Product question</option><option>My order</option><option>Returns</option><option>Restringing</option><option>Teamwear or trade</option><option>Other</option></select></div>
      <div class="field full"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea></div>
    </div>
    <button class="btn btn-accent" type="submit">Send message</button>
  </form></div>
  <aside>
    <div class="box" style="margin-bottom:16px">
      <h2>Phone and email</h2>
      <p style="margin:0"><a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
    </div>
    <div class="box" style="margin-bottom:16px"><h2>Shop</h2><address>${addressLines().map(esc).join('<br>')}</address><div style="margin-top:10px">${hoursTable()}</div></div>
    ${mapEmbed()}
  </aside>
</div></div>`;
  return { path: '/contact/', title: 'Contact Us', description: `Contact ${site.name} in ${site.city}. Phone ${site.phone}, email ${site.email}.`, body, jsonLd: [storeLd(), cr.ld] };
}

function policyPage(path, title, description, html) {
  const cr = withCrumbs([[title, path]]);
  const body = `<div class="wrap">${cr.html}<article class="prose">${pageHead(title)}
<p class="form-note">Last updated: [DATE]</p>
${html}</article></div>`;
  return { path, title, description, body, jsonLd: [cr.ld] };
}

function deliveryPolicy() {
  return policyPage(
    '/delivery/',
    'Delivery',
    `UK delivery costs and times from ${site.name}. Free delivery over ${money(site.freeDeliveryThreshold)}. ${site.dispatchText}.`,
    `
<table class="spec">
  <thead><tr><th>Service</th><th>Cost</th><th>Delivery time</th></tr></thead>
  <tbody>
    <tr><td>UK standard</td><td>${money(site.standardDeliveryCost)}, free over ${money(site.freeDeliveryThreshold)}</td><td>${esc(site.standardDeliveryTime)}</td></tr>
    <tr><td>UK express</td><td>${money(site.expressDeliveryCost)}</td><td>${esc(site.expressDeliveryTime)}</td></tr>
    <tr id="collect"><td>Click and collect</td><td>Free</td><td>${esc(site.clickAndCollect)}</td></tr>
    <tr><td>Highlands, islands, Northern Ireland</td><td>£[X]</td><td>[X–X] working days</td></tr>
    <tr><td>International</td><td colspan="2">[PLACEHOLDER: state whether you ship abroad]</td></tr>
  </tbody>
</table>
<h2>Dispatch</h2>
<p>${esc(site.dispatchText)}. Orders placed after ${esc(site.dispatchCutoff)}, at weekends or on bank holidays are dispatched the next working day.</p>
<p>Rackets ordered with stringing are dispatched [1] working day later.</p>
<p>We send parcels with ${esc(site.courier)}. You will get an email with tracking once your order has been dispatched.</p>
<h2>Missing or damaged parcels</h2>
<p>If your parcel has not arrived within [5] working days of dispatch, or arrives damaged, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> with your order number.</p>`
  );
}

function returnsPolicy() {
  return policyPage(
    '/returns/',
    'Returns',
    `Return unused items to ${site.name} within ${site.returnsDays} days. How to return, refunds and faulty goods.`,
    `
<p class="note">You have ${esc(site.returnsDays)} days from delivery to return unused items in their original condition and packaging.</p>
<h2>How to return</h2>
<ol>
  <li>Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> with your order number and what you are returning.</li>
  <li>Pack the item securely. Rackets should be posted in a racket box or with the head protected.</li>
  <li>Post it to: ${addressLines().map(esc).join(', ')}. Use a tracked service and keep your proof of postage.</li>
  <li>You can also bring returns to the shop with your order confirmation.</li>
</ol>
<h2>Refunds</h2>
<p>We refund to your original payment method within 14 days of receiving the item back. Original standard delivery costs are refunded if you return the whole order. Return postage is paid by you unless the item is faulty or we sent the wrong item.</p>
<h2>What cannot be returned</h2>
<ul>
  <li>Rackets strung to your chosen string and tension (made to your specification), unless faulty.</li>
  <li>Printed or personalised teamwear, unless faulty.</li>
  <li>Opened string sets, overgrips and socks, for hygiene and resale reasons, unless faulty.</li>
  <li>Shoes that have been worn outdoors or on court.</li>
</ul>
<h2>Faulty items</h2>
<p>Your rights under the Consumer Rights Act 2015 are not affected. If something is faulty, contact us with your order number and a photo. Rackets are covered against manufacturing defects. Damage from racket clashes, floor strikes or stringing above the maximum tension printed on the frame is not a manufacturing defect.</p>
<h2>Your legal right to cancel</h2>
<p>Under the Consumer Contracts Regulations 2013 you can cancel an online order within 14 days of receiving it without giving a reason, and must then return the goods within 14 days. Our ${esc(site.returnsDays)}-day returns window is in addition to this right.</p>`
  );
}

function terms() {
  return policyPage(
    '/terms/',
    'Terms and conditions',
    `Terms and conditions of sale for ${site.name}.`,
    `
<p class="note">[PLACEHOLDER: Have these terms checked by a solicitor before launch.]</p>
<h2>1. About us</h2>
<p>This website is run by ${esc(site.legalName)}, registered in ${esc(site.companyRegisteredIn)} under company number ${esc(site.companyNumber)}. Registered office: ${esc(site.registeredOffice)}. VAT number ${esc(site.vatNumber)}. Contact: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>, ${esc(site.phone)}.</p>
<h2>2. Orders</h2>
<p>Your order is an offer to buy. The contract is formed when we email to confirm dispatch. We may decline an order, for example if an item is out of stock or the price shown was wrong. If we decline, we refund you in full.</p>
<h2>3. Prices</h2>
<p>Prices are in pounds sterling and include VAT at the current rate. Delivery charges are shown before you pay.</p>
<h2>4. Delivery</h2>
<p>See our <a href="/delivery/">delivery page</a>. Risk passes to you on delivery.</p>
<h2>5. Cancellation and returns</h2>
<p>See our <a href="/returns/">returns policy</a>. Goods made to your specification, such as rackets strung to your chosen tension and personalised teamwear, are excluded from the 14-day cancellation right unless faulty.</p>
<h2>6. Faulty goods</h2>
<p>Goods must be as described, of satisfactory quality and fit for purpose. Your statutory rights are not affected.</p>
<h2>7. Restringing</h2>
<p>We string to the tension you request up to the maximum printed on the frame. Frames with existing cracks or damage may break during stringing. We inspect frames before stringing and will contact you if we see damage, but we cannot accept liability for breakage of a frame with hidden damage.</p>
<h2>8. Trade accounts</h2>
<p>Trade accounts are subject to separate terms provided on approval.</p>
<h2>9. Law</h2>
<p>These terms are governed by the law of England and Wales. [PLACEHOLDER: adjust if based in Scotland or Northern Ireland.]</p>`
  );
}

function privacy() {
  return policyPage(
    '/privacy/',
    'Privacy and cookies',
    `How ${site.name} collects, uses and protects your personal data.`,
    `
<p class="note">[PLACEHOLDER: Check this notice matches the services you actually use before launch.]</p>
<h2>Who we are</h2>
<p>${esc(site.legalName)} is the data controller for personal data collected through this website. ICO registration number: [PLACEHOLDER]. Contact: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
<h2>What we collect</h2>
<ul>
  <li>Order details: name, delivery and billing address, email, phone number and order history.</li>
  <li>Messages you send through our contact, restringing, teamwear and trade forms.</li>
  <li>Your email address if you sign up to the newsletter.</li>
  <li>Basic technical data such as browser type and pages visited, if analytics is enabled.</li>
</ul>
<p>We do not see or store your full card details. Payments are handled by [PAYMENT PROVIDER].</p>
<h2>Why we use it</h2>
<ul>
  <li>To process and deliver orders (contract).</li>
  <li>To answer enquiries (legitimate interest).</li>
  <li>To send the newsletter (consent; unsubscribe any time).</li>
  <li>To keep accounting records (legal obligation).</li>
</ul>
<h2>Who we share it with</h2>
<p>Only the services needed to run the shop: [e-commerce platform], [payment provider], ${esc(site.courier)}, [email provider], [analytics provider]. We do not sell personal data.</p>
<h2>How long we keep it</h2>
<p>Order records are kept for six years for tax purposes. Newsletter data is kept until you unsubscribe.</p>
<h2>Your rights</h2>
<p>You can ask for a copy of your data, ask us to correct or delete it, or object to how we use it. Email us to do so. You can also complain to the Information Commissioner's Office at ico.org.uk.</p>
<h2>Cookies</h2>
<p>This site uses your browser's local storage to remember the contents of your basket. It sets no tracking cookies. [PLACEHOLDER: update this section, and add a consent banner, if you add analytics, the Trustpilot widget, Google Maps or advertising tags.]</p>`
  );
}

// =====================================================================
// Utility pages
// =====================================================================
function cart() {
  const body = `<div class="wrap">
${pageHead('Basket')}
<div class="cols-2" data-cart-page>
  <div>
    <ul class="cart-lines" data-cart-lines></ul>
    <p class="empty" data-cart-empty hidden>Your basket is empty. <a href="/rackets/">Shop rackets</a></p>
    <noscript><p class="note">The basket needs JavaScript turned on.</p></noscript>
  </div>
  <aside class="summary">
    <div class="box">
      <h2>Order summary</h2>
      <table><tbody>
        <tr><th>Subtotal</th><td data-subtotal>£0.00</td></tr>
        <tr><th>Delivery</th><td data-delivery>Calculated at checkout</td></tr>
        <tr class="total"><th>Total</th><td data-total>£0.00</td></tr>
      </tbody></table>
      <p class="form-note" data-free-msg></p>
      ${
        site.checkoutUrl
          ? `<a class="btn btn-accent btn-block" href="${esc(site.checkoutUrl)}" data-checkout>Checkout</a>`
          : `<button class="btn btn-accent btn-block" type="button" disabled>Checkout</button><p class="form-note">[PLACEHOLDER: checkout connects here once a payment provider is set up. See README.]</p>`
      }
    </div>
    <div class="box" style="margin-top:16px">${deliveryList()}</div>
  </aside>
</div></div>`;
  return { path: '/cart/', title: 'Basket', description: 'Your basket.', body, noindex: true };
}

function account() {
  const body = `<div class="wrap">${pageHead('Account', 'Sign in to see your orders and saved addresses.')}
<div class="cols-2"><div class="box">
  <h2>Sign in</h2>
  <p class="note">[PLACEHOLDER: customer accounts are provided by your e-commerce platform. Link this page to its login once connected.]</p>
  <form action="#" method="post" onsubmit="return false">
    <div class="field"><label for="l-email">Email</label><input id="l-email" type="email" autocomplete="email"></div>
    <div class="field"><label for="l-pass">Password</label><input id="l-pass" type="password" autocomplete="current-password"></div>
    <button class="btn" type="submit" disabled>Sign in</button>
  </form>
</div>
<aside class="box"><h2>No account?</h2><p>You can check out as a guest. To ask about an order, <a href="/contact/">contact us</a> with your order number.</p></aside>
</div></div>`;
  return { path: '/account/', title: 'Account', description: 'Sign in to your account.', body, noindex: true };
}

function search() {
  const body = `<div class="wrap search-page">${pageHead('Search')}
<form action="/search/" method="get" role="search"><label class="vh" for="sq">Search products</label><input id="sq" name="q" type="search" placeholder="Search rackets, shoes, strings"><button class="btn" type="submit">Search</button></form>
<p class="count" data-search-count aria-live="polite"></p>
<div class="grid grid-wide" data-search-results></div>
<noscript><p class="note">Search needs JavaScript. Browse by category from the menu instead.</p></noscript>
</div>`;
  return { path: '/search/', title: 'Search', description: `Search ${site.name}.`, body, noindex: true };
}

function notFound() {
  const body = `<div class="wrap" style="padding:40px var(--gut)">${pageHead('Page not found', 'That page does not exist or has moved.')}
<p><a class="btn" href="/">Home page</a> <a class="btn btn-line" href="/search/">Search</a></p></div>`;
  return { path: '/404.html', file: '404.html', title: 'Page not found', description: 'Page not found.', body, noindex: true };
}

// =====================================================================
export function allPages() {
  return [
    home(),
    ...categoryPages(),
    collectionPage({
      path: '/new-arrivals/',
      title: 'New arrivals',
      intro: 'The latest stock across rackets, shoes, bags and accessories.',
      seoDescription: 'New badminton rackets, shoes, bags, shuttles and clothing.',
      list: [...products].sort(byNew),
      crumbs: [['New arrivals', '/new-arrivals/']],
      showCategory: true,
      defaultSort: 'new',
    }),
    collectionPage({
      path: '/best-sellers/',
      title: 'Best sellers',
      intro: 'What sells most in the shop and online.',
      seoDescription: 'Our best-selling badminton rackets, shoes, shuttles and strings.',
      list: products.filter((p) => p.best).sort(byBest),
      crumbs: [['Best sellers', '/best-sellers/']],
      showCategory: true,
      defaultSort: 'best',
    }),
    ...products.map(productPage),
    racketFinder(),
    services(),
    restringing(),
    teamwear(),
    trade(),
    visit(),
    guidesIndex(),
    ...guides.map(guidePage),
    blogIndex(),
    ...posts.map(postPage),
    faqPage(),
    contact(),
    deliveryPolicy(),
    returnsPolicy(),
    terms(),
    privacy(),
    cart(),
    account(),
    search(),
    notFound(),
  ];
}
