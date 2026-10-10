import fs from 'node:fs';
import path from 'node:path';
import { site, money, addressLines } from '../config.mjs';
import { categories, levels, serviceMenu, guideMenu } from '../data/categories.mjs';
import { products, brands, totalStock } from '../data/products.mjs';

export const STATIC_DIR = path.resolve('src/static');

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ---------- Images ----------
// Looks for a real photo at src/static/img/<base>.(webp|jpg|jpeg|png). If none
// exists, renders a grey placeholder saying which photo belongs there.
const EXTS = ['webp', 'jpg', 'jpeg', 'png'];
export function findImage(base) {
  for (const ext of EXTS) {
    const rel = `img/${base}.${ext}`;
    if (fs.existsSync(path.join(STATIC_DIR, rel))) return `/${rel}`;
  }
  return null;
}

export function photo(base, label, { ratio = '1 / 1', eager = false, alt, cls = '' } = {}) {
  const src = findImage(base);
  const style = `aspect-ratio:${ratio}`;
  if (src) {
    return `<img class="photo ${cls}" src="${src}" alt="${esc(alt ?? label)}" style="${style}" ${
      eager ? 'fetchpriority="high"' : 'loading="lazy"'
    } decoding="async">`;
  }
  return `<div class="ph ${cls}" style="${style}" role="img" aria-label="${esc(alt ?? label)}"><span>Photo: ${esc(
    label
  )}<br><small>${esc(base)}.jpg</small></span></div>`;
}

export const productPhotoBase = (p, n = 1) => `products/${p.slug}-${n}`;

// ---------- Small helpers ----------
export const icon = {
  search:
    '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  user:
    '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  bag:
    '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu:
    '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close:
    '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  chevron:
    '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>',
};

export function stockInfo(n) {
  if (n <= 0) return { cls: 'out', text: 'Out of stock' };
  if (n <= 3) return { cls: 'low', text: `Low stock: ${n} left` };
  return { cls: 'in', text: 'In stock' };
}

export function breadcrumbs(items) {
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map(([label, href], i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(label)}</li>`
        : `<li><a href="${href}">${esc(label)}</a></li>`
    )
    .join('')}</ol></nav>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([label, href], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: label,
      item: site.url + (href || ''),
    })),
  };
  return { html, ld };
}

export function sectionHead(title, link) {
  return `<div class="sec-head"><h2>${esc(title)}</h2>${
    link ? `<a class="sec-link" href="${link[1]}">${esc(link[0])}</a>` : ''
  }</div>`;
}

// ---------- Product card ----------
export function productCard(p, { eager = false } = {}) {
  const stock = stockInfo(totalStock(p));
  const meta =
    p.category === 'rackets'
      ? [p.weight, p.balance, p.flex].filter(Boolean).join(' · ')
      : p.type;
  const data = {
    brand: slugify(p.brand),
    price: p.price,
    weight: p.weight || '',
    balance: p.balance ? slugify(p.balance) : '',
    level: p.level.join(' '),
    type: slugify(p.type || ''),
    cat: p.category,
    added: p.added,
    best: p.best ?? 999,
    name: p.name.toLowerCase(),
    stock: totalStock(p) > 0 ? 1 : 0,
  };
  const attrs = Object.entries(data)
    .map(([k, v]) => `data-${k}="${esc(v)}"`)
    .join(' ');
  return `<article class="card" ${attrs}>
  <a class="card-img" href="/products/${p.slug}/" tabindex="-1" aria-hidden="true">${photo(productPhotoBase(p), p.name, {
    eager,
  })}</a>
  <div class="card-body">
    <p class="label">${esc(p.brand)}</p>
    <h3 class="card-title"><a href="/products/${p.slug}/">${esc(p.name)}</a></h3>
    ${meta ? `<p class="card-meta">${esc(meta)}</p>` : ''}
    <p class="card-price">${p.was ? `<s>${money(p.was)}</s> ` : ''}${money(p.price)}</p>
    <p class="stock stock-${stock.cls}">${stock.text}</p>
  </div>
</article>`;
}

export const productGrid = (list, cls = '') =>
  `<div class="grid ${cls}">${list.map((p) => productCard(p)).join('')}</div>`;

// ---------- Trust components ----------
export function deliveryList() {
  return `<ul class="facts">
  <li><strong>Standard delivery</strong> ${money(site.standardDeliveryCost)}, free over ${money(site.freeDeliveryThreshold)}. ${esc(site.standardDeliveryTime)}.</li>
  <li><strong>Express delivery</strong> ${money(site.expressDeliveryCost)}, ${esc(site.expressDeliveryTime)}.</li>
  <li><strong>Dispatch</strong> ${esc(site.dispatchText)}.</li>
  <li><strong>Click and collect</strong> ${esc(site.clickAndCollect)}.</li>
  <li><strong>Returns</strong> ${esc(site.returnsDays)} days to return unused items. <a href="/returns/">Returns policy</a></li>
</ul>`;
}

export function mapEmbed() {
  if (site.mapQuery.includes('[')) {
    return `<div class="ph map" role="img" aria-label="Map placeholder"><span>Map: Google map of the shop.<br><small>Appears once the address is set in src/config.mjs (mapQuery)</small></span></div>`;
  }
  return `<iframe class="map" title="Map showing ${esc(site.name)} in ${esc(site.city)}" src="https://www.google.com/maps?q=${encodeURIComponent(
    site.mapQuery
  )}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}

export function hoursTable() {
  return `<table class="hours"><caption class="vh">Opening hours</caption><tbody>${site.hours
    .map(([d, h]) => `<tr><th scope="row">${d}</th><td>${esc(h)}</td></tr>`)
    .join('')}</tbody></table>`;
}

export function reviewsSection({ heading = 'Customer reviews' } = {}) {
  // Wired to Trustpilot. Stays empty until site.trustpilotBusinessUnitId is set.
  // Never add reviews or star ratings by hand.
  const id = site.trustpilotBusinessUnitId;
  const body = id
    ? `<div class="trustpilot-widget" data-locale="en-GB" data-template-id="53aa8912dec7e10d38f59f36" data-businessunit-id="${esc(
        id
      )}" data-style-height="140px" data-style-width="100%" data-theme="light">
  <a href="https://uk.trustpilot.com/review/${esc(site.trustpilotDomain)}" target="_blank" rel="noopener">Read our reviews on Trustpilot</a>
</div>
<script async src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"></script>`
    : `<div class="reviews-empty"><p>Reviews from Trustpilot will be shown here.</p><!-- Set trustpilotBusinessUnitId in src/config.mjs to connect. --></div>`;
  return `<section class="sec reviews" aria-labelledby="reviews-h"><div class="wrap">
  <div class="sec-head"><h2 id="reviews-h">${esc(heading)}</h2></div>
  ${body}
</div></section>`;
}

export function formAttrs(name) {
  return site.formEndpoint
    ? `action="${esc(site.formEndpoint)}" method="post"`
    : `action="#" method="post" data-unconnected="${esc(name)}"`;
}

// ---------- Header / nav ----------
function megaColumns(cat) {
  const inCat = products.filter((p) => p.category === cat.id);
  const catBrands = [...new Set(inCat.map((p) => p.brand))].sort();
  const types = cat.types.filter((t) => inCat.some((p) => p.type === t));
  return [
    { heading: 'By brand', links: catBrands.map((b) => [b, `${cat.path}?brand=${slugify(b)}`]) },
    { heading: 'By type', links: cat.menuTypes || types.map((t) => [t, `${cat.path}?type=${slugify(t)}`]) },
    {
      heading: 'By level',
      links: levels
        .filter((l) => inCat.some((p) => p.level.includes(l.id)))
        .map((l) => [l.label, `${cat.path}?level=${l.id}`]),
    },
  ];
}

function megaItem(label, href, columns, extra) {
  const id = `mega-${slugify(label)}`;
  return `<li class="nav-item">
  <div class="nav-top"><a href="${href}">${esc(label)}</a><button class="sub-toggle" type="button" aria-expanded="false" aria-controls="${id}"><span class="vh">${esc(
    label
  )} menu</span>${icon.chevron}</button></div>
  <div class="mega" id="${id}"><div class="wrap mega-grid">
    ${columns
      .map(
        (c) =>
          `<div class="mega-col"><p class="label">${esc(c.heading)}</p><ul>${c.links
            .map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`)
            .join('')}</ul></div>`
      )
      .join('')}
    <div class="mega-col mega-all"><p class="label">Shop</p><ul><li><a href="${href}"><strong>All ${esc(
    label.toLowerCase()
  )}</strong></a></li>${extra || ''}</ul></div>
  </div></div>
</li>`;
}

export function header() {
  const shopItems = categories
    .map((c) =>
      megaItem(
        c.label,
        c.path,
        megaColumns(c),
        `<li><a href="${c.path}?sort=new">New in</a></li><li><a href="${c.path}?sort=best">Best sellers</a></li>`
      )
    )
    .join('');
  const svc = megaItem(serviceMenu.label, serviceMenu.path, serviceMenu.columns, '');
  const gd = megaItem(guideMenu.label, guideMenu.path, guideMenu.columns, '<li><a href="/blog/">Blog</a></li>');
  return `<a class="skip" href="#main">Skip to content</a>
<div class="announce"><div class="wrap">
  <span>Free UK delivery over ${money(site.freeDeliveryThreshold)}</span>
  <span class="hide-sm">Same-day restringing in ${esc(site.city)}</span>
  <span class="hide-sm">${esc(site.returnsDays)}-day returns</span>
</div></div>
<header class="hdr">
  <div class="wrap hdr-row">
    <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="nav">${icon.menu}<span class="vh">Menu</span></button>
    <a class="logo" href="/" aria-label="${esc(site.name)} home">${esc(site.name)}</a>
    <form class="search" action="/search/" method="get" role="search">
      <label class="vh" for="q">Search products</label>
      <input id="q" name="q" type="search" placeholder="Search rackets, shoes, strings" autocomplete="off">
      <button type="submit">${icon.search}<span class="vh">Search</span></button>
    </form>
    <div class="util">
      <a class="icon-btn" href="/account/">${icon.user}<span class="util-label">Account</span></a>
      <a class="icon-btn cart-link" href="/cart/">${icon.bag}<span class="util-label">Basket</span><span class="cart-count" data-cart-count>0</span></a>
    </div>
  </div>
  <nav id="nav" class="nav" aria-label="Main">
    <div class="nav-head"><span class="label">Menu</span><button class="icon-btn menu-close" type="button">${icon.close}<span class="vh">Close menu</span></button></div>
    <ul class="wrap nav-list">${shopItems}${svc}${gd}</ul>
  </nav>
</header>`;
}

// ---------- Footer ----------
function paymentIcons() {
  return `<ul class="pay" aria-label="Payment methods we accept">${site.payments
    .map((m) => `<li>${esc(m)}</li>`)
    .join('')}</ul>`;
}

export function footer() {
  const col = (h, links) =>
    `<div class="f-col"><p class="f-h">${h}</p><ul>${links
      .map(([l, href]) => `<li><a href="${href}">${esc(l)}</a></li>`)
      .join('')}</ul></div>`;
  return `<footer class="ftr">
  <div class="wrap f-grid">
    <div class="f-col f-contact">
      <p class="f-h">${esc(site.name)}</p>
      <address>
        ${addressLines().map(esc).join('<br>')}<br>
        <a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a><br>
        <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
      </address>
      <p class="f-h f-h2">Opening hours</p>
      ${hoursTable()}
    </div>
    ${col('Shop', categories.map((c) => [c.label, c.path]).concat([['New arrivals', '/new-arrivals/'], ['Best sellers', '/best-sellers/']]))}
    ${col('Services', [
      ['Restringing', '/restringing/'],
      ['Racket Finder', '/racket-finder/'],
      ['Teamwear', '/teamwear/'],
      ['Club and coach accounts', '/trade-accounts/'],
      ['Visit our store', '/visit-our-store/'],
      ['Buying guides', '/guides/'],
      ['Blog', '/blog/'],
    ])}
    ${col('Help', [
      ['Contact us', '/contact/'],
      ['FAQ', '/faq/'],
      ['Delivery', '/delivery/'],
      ['Returns', '/returns/'],
      ['Terms and conditions', '/terms/'],
      ['Privacy and cookies', '/privacy/'],
    ])}
  </div>
  <div class="wrap f-base">
    ${paymentIcons()}
    <p class="f-legal">${esc(site.legalName)}. Registered in ${esc(site.companyRegisteredIn)}, company no. ${esc(
    site.companyNumber
  )}. Registered office: ${esc(site.registeredOffice)}. VAT no. ${esc(site.vatNumber)}.</p>
    <p class="f-legal">&copy; ${new Date().getFullYear()} ${esc(site.name)}. Prices include VAT.</p>
  </div>
</footer>`;
}

// ---------- Page shell ----------
export function layout({ title, description, path: urlPath, body, jsonLd = [], noindex = false, ogImage, bodyClass = '' }) {
  const fullTitle = urlPath === '/' ? title : `${title} | ${site.name}`;
  const canonical = site.url + urlPath;
  const ld = jsonLd.length
    ? jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')
    : '';
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
${ogImage ? `<meta property="og:image" content="${site.url}${ogImage}">` : ''}
<meta name="theme-color" content="#111111">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v=${BUILD_ID}">
<style>:root{--accent:${site.accent};--accent-dark:${site.accentDark}}</style>
${ld}
</head>
<body class="${bodyClass}">
${header()}
<main id="main">
${body}
</main>
${footer()}
<script src="/js/site.js?v=${BUILD_ID}" defer></script>
</body>
</html>`;
}

export const BUILD_ID = Date.now().toString(36);

export { site, money, categories, levels, products, brands };
