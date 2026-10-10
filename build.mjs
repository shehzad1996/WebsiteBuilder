// Static site build: node build.mjs  ->  dist/
import fs from 'node:fs';
import path from 'node:path';
import { allPages } from './src/pages.mjs';
import { layout, findImage, productPhotoBase, STATIC_DIR } from './src/lib/html.mjs';
import { site, money } from './src/config.mjs';
import { products, totalStock } from './src/data/products.mjs';
import { categoryById } from './src/data/categories.mjs';

const OUT = path.resolve('dist');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(STATIC_DIR, OUT, { recursive: true });

const pages = allPages();
for (const p of pages) {
  const file = p.file ? path.join(OUT, p.file) : path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(p));
}

// Product index for search, Racket Finder and basket.
const index = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  cat: p.category,
  catLabel: categoryById[p.category].label,
  type: p.type,
  level: p.level,
  price: p.price,
  weight: p.weight,
  balance: p.balance,
  flex: p.flex,
  stock: totalStock(p),
  img: findImage(productPhotoBase(p)),
}));
fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
fs.writeFileSync(
  path.join(OUT, 'data/products.json'),
  JSON.stringify({
    products: index,
    shop: {
      freeOver: site.freeDeliveryThreshold,
      delivery: site.standardDeliveryCost,
      freeOverLabel: money(site.freeDeliveryThreshold),
      deliveryLabel: money(site.standardDeliveryCost),
    },
  })
);

// sitemap + robots
const urls = pages.filter((p) => !p.noindex && !p.file).map((p) => `<url><loc>${site.url}${p.path}</loc></url>`);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  `User-agent: *\nDisallow: /cart/\nDisallow: /account/\nDisallow: /search/\n\nSitemap: ${site.url}/sitemap.xml\n`
);

console.log(`Built ${pages.length} pages into dist/`);
