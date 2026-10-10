// Pre-launch checks on dist/: banned copy, emoji, broken internal links,
// missing titles/descriptions, and design rules (no gradients).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(ROOT);

const BANNED = ['elevate', 'unleash', 'seamless', 'cutting-edge', 'passion', 'journey', 'game-changer', 'game changer', 'discover'];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2728}]/u;
let problems = 0;
const fail = (msg) => { problems++; console.log('  ' + msg); };

const titles = new Map();
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const w of BANNED) if (new RegExp(`\\b${w}`, 'i').test(text)) fail(`${rel}: banned word "${w}"`);
  if (EMOJI.test(html)) fail(`${rel}: emoji`);
  const t = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!t) fail(`${rel}: no <title>`);
  if (!d) fail(`${rel}: no meta description`);
  if (t && titles.has(t)) fail(`${rel}: duplicate title with ${titles.get(t)}`);
  titles.set(t, rel);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: expected exactly one <h1>`);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = path.join(ROOT, href);
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
    if (!ok) fail(`${rel}: broken link ${href}`);
  }
}
for (const f of files.filter((f) => /\.(css|html)$/.test(f))) {
  if (/gradient\(|backdrop-filter/.test(fs.readFileSync(f, 'utf8'))) fail(`${path.relative(ROOT, f)}: gradient or blur`);
}
console.log(problems ? `${problems} problem(s)` : `OK: ${files.length} files checked`);
process.exit(problems ? 1 : 0);
