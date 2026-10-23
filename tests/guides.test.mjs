import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  guidePages,
  guidePath,
} from '../client/src/data/guidePages.js';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'client', 'dist');
const homeHtmlPath = path.join(dist, 'index.html');

const decode = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

function readPage(slug) {
  return fs.readFileSync(path.join(dist, slug, 'index.html'), 'utf8');
}

function headings(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]),
    text: decode(match[2].replace(/<[^>]+>/g, '')),
  }));
}

function ids(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

function routeExists(href) {
  const clean = href.split('?')[0].split('#')[0];
  if (!clean || !clean.startsWith('/')) return true;
  if (clean === '/') return fs.existsSync(homeHtmlPath);
  if (clean.endsWith('/')) {
    return fs.existsSync(path.join(dist, clean.slice(1), 'index.html'));
  }
  return fs.existsSync(path.join(dist, clean.slice(1)));
}

test('the beginner guide data is complete and internally consistent', () => {
  assert.equal(guidePages.length, 6);
  assert.deepEqual(
    guidePages.map((page) => page.slug),
    [
      'learn-chess',
      'chess-rules',
      'how-chess-pieces-move',
      'special-moves',
      'scholars-mate',
      'chess-notation',
    ]
  );

  const slugs = new Set(guidePages.map((page) => page.slug));
  assert.equal(
    new Set(guidePages.map((page) => page.title)).size,
    guidePages.length,
    'guide titles must be unique'
  );
  assert.equal(
    new Set(guidePages.map((page) => page.description)).size,
    guidePages.length,
    'guide descriptions must be unique'
  );
  assert.equal(
    new Set(guidePages.map((page) => page.h1)).size,
    guidePages.length,
    'guide h1s must be unique'
  );
  for (const page of guidePages) {
    assert.ok(page.title.length >= 20 && page.title.length <= 60, page.title);
    assert.ok(
      page.description.length >= 120 && page.description.length <= 160,
      `${page.slug} description is ${page.description.length} characters`
    );
    assert.ok(page.h1.length > 10);
    assert.ok(page.sections.length >= 4);
    assert.ok(page.faqs.length >= 3);
    assert.ok(page.sources.length >= 1);
    assert.ok(page.sections.every((section) => section.id && section.title));
    assert.equal(new Set(page.sections.map((section) => section.id)).size, page.sections.length);
    for (const related of page.related) {
      assert.ok(slugs.has(related), `${page.slug} links to unknown guide ${related}`);
    }
    for (const section of page.sections) {
      for (const link of section.links ?? []) {
        assert.ok(
          slugs.has(link.slug),
          `${page.slug} links to unknown guide ${link.slug}`
        );
      }
    }
    assert.equal(
      guidePath(page.slug),
      `/${page.slug}/`,
      'guide paths must include a trailing slash'
    );
  }
});

test('every guide page is pre-rendered with its own metadata', () => {
  for (const page of guidePages) {
    const file = path.join(dist, page.slug, 'index.html');
    assert.ok(fs.existsSync(file), `missing ${page.slug}/index.html`);

    const html = fs.readFileSync(file, 'utf8');
    const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? '');
    const description = decode(
      html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1] ?? ''
    );
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? '';
    const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1] ?? '';

    assert.equal(title, page.title);
    assert.equal(description, page.description);
    assert.match(canonical, new RegExp(`/${page.slug}/$`));
    assert.equal(ogUrl, canonical);
    assert.match(html, /<meta property="og:type" content="article" \/>/);
    assert.match(html, /<meta property="article:published_time"/);
    assert.match(html, /<meta property="article:modified_time"/);
    assert.match(html, /name="google-site-verification"/);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="robots"\s+content="index, follow/);
    assert.doesNotMatch(html, /localhost:4000/);
  }
});

test('every guide has one h1, a clean heading order, and unique IDs', () => {
  for (const page of guidePages) {
    const html = readPage(page.slug);
    const pageHeadings = headings(html);
    assert.equal(
      pageHeadings.filter((heading) => heading.level === 1).length,
      1,
      `${page.slug} must have exactly one h1`
    );
    assert.equal(pageHeadings[0].text, page.h1);
    assert.ok(
      pageHeadings.filter((heading) => heading.level === 2).length >= page.sections.length + 3
    );

    let previous = 1;
    for (const heading of pageHeadings) {
      assert.ok(
        heading.level <= previous + 1,
        `${page.slug} jumps from h${previous} to h${heading.level}`
      );
      previous = heading.level;
    }

    const allIds = ids(html);
    assert.equal(
      new Set(allIds).size,
      allIds.length,
      `${page.slug} has duplicate IDs`
    );
  }
});

test('guide anchors and internal links resolve', () => {
  const homeHtml = fs.existsSync(homeHtmlPath)
    ? fs.readFileSync(homeHtmlPath, 'utf8')
    : '';
  const homeIds = new Set(ids(homeHtml));

  for (const page of guidePages) {
    const html = readPage(page.slug);
    const pageIds = new Set(ids(html));
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

    for (const href of links) {
      if (href.startsWith('#')) {
        assert.ok(pageIds.has(href.slice(1)), `${page.slug} missing anchor ${href}`);
      } else if (href.startsWith('/#')) {
        assert.ok(
          homeIds.has(href.slice(2)),
          `${page.slug} missing home anchor ${href}`
        );
      } else if (href.startsWith('/')) {
        assert.ok(routeExists(href), `${page.slug} links to missing route ${href}`);
      }
    }
  }
});

test('guide structured data matches the visible page', () => {
  for (const page of guidePages) {
    const html = readPage(page.slug);
    const script = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    )?.[1];
    assert.ok(script, `${page.slug} is missing JSON-LD`);

    const graph = JSON.parse(script);
    const types = graph.map((entry) => entry['@type']);
    assert.ok(types.includes('Article'));
    assert.ok(types.includes('BreadcrumbList'));
    assert.ok(types.includes('FAQPage'));
    if (page.slug === 'scholars-mate') assert.ok(types.includes('HowTo'));

    const article = graph.find((entry) => entry['@type'] === 'Article');
    assert.equal(article.headline, page.h1);
    assert.equal(article.description, page.description);
    assert.match(article.mainEntityOfPage, /^https?:\/\/.+\/$/);
    assert.ok(article.mainEntityOfPage.endsWith(guidePath(page.slug)));
    assert.ok(article.url.endsWith(guidePath(page.slug)));
    assert.ok(article.image.endsWith('/og-image.png'));
    assert.ok(article.isPartOf.url.endsWith('/'));

    const breadcrumb = graph.find((entry) => entry['@type'] === 'BreadcrumbList');
    assert.ok(
      breadcrumb.itemListElement.every((item) => /^https?:\/\//.test(item.item)),
      `${page.slug} breadcrumb items must be absolute URLs`
    );

    const faq = graph.find((entry) => entry['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, page.faqs.length);
    for (const [index, item] of page.faqs.entries()) {
      assert.equal(faq.mainEntity[index].name, item.question);
      assert.equal(faq.mainEntity[index].acceptedAnswer.text, item.answer);
    }

    for (const faqItem of page.faqs) {
      assert.ok(html.includes(faqItem.question), `missing FAQ question: ${faqItem.question}`);
      assert.ok(html.includes(faqItem.answer), `missing FAQ answer: ${faqItem.question}`);
    }
  }
});

test('the sitemap includes the homepage and every guide', () => {
  const sitemapPath = path.join(dist, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath));
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  );

  assert.equal(locations.length, guidePages.length + 1);
  assert.ok(locations.some((location) => location.endsWith('/')));
  for (const page of guidePages) {
    assert.ok(
      locations.some((location) => location.endsWith(`/${page.slug}/`)),
      `sitemap is missing ${page.slug}`
    );
  }
});
