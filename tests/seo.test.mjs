import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'client', 'dist');
const htmlPath = path.join(dist, 'index.html');

const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

const decode = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

test('the production build is server-rendered before JavaScript runs', () => {
  assert.ok(html.length > 20000, 'expected a substantial prerendered document');
  const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  assert.ok(rootMatch, 'expected prerendered markup inside #root');
  assert.ok(rootMatch[1].length > 10000, 'expected real content inside #root');
  assert.match(visibleText, /The 64 Squares/);
  assert.match(visibleText, /Scholar’s Mate/);
  assert.match(visibleText, /The rules, without the mystery/);
  assert.match(visibleText, /Before your first move/);
  assert.match(visibleText, /Anderssen/);
  assert.match(visibleText, /Where this comes from/);
});

test('the document has unique, useful metadata', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<meta charset="UTF-8" \/>/);

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  assert.ok(title.length >= 20 && title.length <= 60, `title is ${title.length} characters`);

  const description = decode(
    html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1] ?? ''
  );
  assert.ok(
    description.length >= 120 && description.length <= 160,
    `description is ${description.length} characters`
  );

  assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+" \/>/);
  assert.match(html, /<meta property="og:title" content="[^"]+"/);
  assert.match(html, /<meta property="og:image" content="https?:\/\/[^"]+\.png"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /<meta\s+name="robots"\s+content="index, follow/);
});

test('FAQ, Article and HowTo structured data is valid JSON', () => {
  const script = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  )?.[1];
  assert.ok(script, 'expected JSON-LD in the prerendered page');
  const graph = JSON.parse(script);
  assert.ok(Array.isArray(graph));

  const types = graph.map((entry) => entry['@type']);
  assert.ok(types.includes('WebSite'));
  assert.ok(types.includes('Article'));
  assert.ok(types.includes('FAQPage'));
  assert.ok(types.includes('HowTo'));

  const website = graph.find((entry) => entry['@type'] === 'WebSite');
  const article = graph.find((entry) => entry['@type'] === 'Article');
  assert.match(website.url, /^https?:\/\/.+\/$/);
  assert.match(article.url, /^https?:\/\/.+\/$/);
  assert.match(article.image, /^https?:\/\/.+\/og-image\.png$/);
  assert.match(article.mainEntityOfPage, /^https?:\/\/.+\/$/);

  const faq = graph.find((entry) => entry['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 5);
  assert.equal(faq.mainEntity[0]['@type'], 'Question');
  assert.equal(faq.mainEntity[0].acceptedAnswer['@type'], 'Answer');
  assert.match(visibleText, /Do I need to memorize openings/);

  const howTo = graph.find((entry) => entry['@type'] === 'HowTo');
  assert.equal(howTo.step.length, 7);
  assert.equal(howTo.step[6].name, '4. Qxf7#');
});

test('the page has one h1 and a non-skipping heading order', () => {
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/g)].map((match) =>
    Number(match[1])
  );
  assert.equal(headings.filter((level) => level === 1).length, 1);
  assert.ok(headings.filter((level) => level === 2).length >= 8);

  let previous = 1;
  for (const level of headings) {
    assert.ok(
      level <= previous + 1,
      `heading level jumped from h${previous} to h${level}`
    );
    previous = level;
  }
});

test('all internal links resolve to real sections', () => {
  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  );
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(
    (match) => match[1]
  );
  assert.ok(anchors.length >= 12, `expected internal links, found ${anchors.length}`);
  for (const anchor of anchors) {
    assert.ok(ids.has(anchor), `missing anchor target: #${anchor}`);
  }

  const duplicateIds = [...html.matchAll(/\sid="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((id, index, all) => all.indexOf(id) !== index);
  assert.deepEqual(duplicateIds, []);
});

test('images are lazy where appropriate and every image has an alt attribute', () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(images.length > 0);
  for (const image of images) {
    assert.match(image, /\salt="[^"]*"/, `image missing alt: ${image}`);
  }
  assert.ok(images.some((image) => /loading="lazy"/.test(image)));
});

test('crawl and social assets exist in the build', () => {
  for (const file of [
    'favicon.svg',
    'apple-touch-icon.png',
    'og-image.png',
    'robots.txt',
    'sitemap.xml',
  ]) {
    assert.ok(fs.existsSync(path.join(dist, file)), `missing dist/${file}`);
  }

  const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https?:\/\/[^\s]+/);

  const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<urlset/);
  assert.match(sitemap, /<loc>https?:\/\/[^<]+<\/loc>/);
  assert.match(sitemap, /<\/urlset>/);
});
