import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { guidePages } from '../src/data/guidePages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');
const distDir = path.join(clientRoot, 'dist');
const ssrDir = path.join(clientRoot, 'dist-ssr');
const indexPath = path.join(distDir, 'index.html');
const ssrEntry = path.join(ssrDir, 'entry-server.js');
const siteUrl = (process.env.SITE_URL || 'http://localhost:4000').replace(
  /\/$/,
  ''
);

if (!fs.existsSync(indexPath)) {
  throw new Error('Client build not found. Run "vite build" first.');
}

if (!fs.existsSync(ssrEntry)) {
  throw new Error('SSR build not found. Run "vite build --ssr" first.');
}

const { render } = await import(pathToFileURL(ssrEntry).href);
let baseHtml = fs.readFileSync(indexPath, 'utf8');
const lastmod = new Date().toISOString().slice(0, 10);
const socialImage = `${siteUrl}/og-image.png`;

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const absolute = (pathname) => `${siteUrl}${pathname}`;

function replaceTitle(html, title) {
  return html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );
}

function upsertMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${escapedKey}"[\\s\\S]*?\\/>`,
    'i'
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;

  if (pattern.test(html)) return html.replace(pattern, tag);

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  const pattern = /<link\s+rel="canonical"[^>]*>/i;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function pageHtml(page, appHtml) {
  let html = baseHtml;

  if (page) {
    const pageUrl = absolute(`/${page.slug}/`);
    html = replaceTitle(html, page.title);
    html = upsertMeta(html, 'name', 'description', page.description);
    html = upsertMeta(html, 'property', 'og:type', 'article');
    html = upsertMeta(html, 'property', 'og:title', page.title);
    html = upsertMeta(html, 'property', 'og:description', page.description);
    html = upsertMeta(html, 'property', 'og:url', pageUrl);
    html = upsertMeta(html, 'property', 'og:image', socialImage);
    html = upsertMeta(html, 'property', 'article:published_time', page.published);
    html = upsertMeta(html, 'property', 'article:modified_time', page.updated);
    html = upsertMeta(html, 'property', 'article:section', page.navLabel);
    html = upsertMeta(html, 'name', 'twitter:title', page.title);
    html = upsertMeta(html, 'name', 'twitter:description', page.description);
    html = upsertMeta(html, 'name', 'twitter:image', socialImage);
    html = upsertCanonical(html, pageUrl);
  } else {
    const homeUrl = absolute('/');
    html = upsertMeta(html, 'property', 'og:url', homeUrl);
    html = upsertMeta(html, 'property', 'og:image', socialImage);
    html = upsertMeta(html, 'name', 'twitter:image', socialImage);
    html = upsertCanonical(html, homeUrl);
  }

  const rootPattern = /<div id="root"><\/div>/;
  if (!rootPattern.test(html)) {
    throw new Error('Could not find an empty #root in the client build.');
  }

  return html.replace(rootPattern, `<div id="root">${appHtml}</div>`);
}

function writePage(route, page = null) {
  const appHtml = render(route);
  const html = pageHtml(page, appHtml);
  const target =
    route === '/'
      ? indexPath
      : path.join(distDir, route.replace(/^\/|\/$/g, ''), 'index.html');

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  return appHtml.length;
}

// Inline the extracted stylesheet once. Every pre-rendered route uses the
// same generated CSS, so the first paint is styled before JavaScript loads.
let inlinedCssBytes = 0;
const stylesheetPattern = /<link[^>]+rel="stylesheet"[^>]*>/i;
const stylesheetTag = baseHtml.match(stylesheetPattern)?.[0];
if (stylesheetTag) {
  const href = stylesheetTag.match(/href="([^"]+\.css)"/);
  if (href) {
    const cssPath = path.join(distDir, href[1].replace(/^\//, ''));
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf8');
      inlinedCssBytes = Buffer.byteLength(css);
      baseHtml = baseHtml.replace(stylesheetTag, `<style>${css}</style>`);
    }
  }
}

const homeBytes = writePage('/');
let totalBytes = homeBytes;

for (const page of guidePages) {
  totalBytes += writePage(`/${page.slug}/`, page);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
${guidePages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.slug}/</loc>
    <lastmod>${page.updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.slug === 'learn-chess' ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

console.log(
  `Prerendered ${(totalBytes / 1024).toFixed(1)} KB of HTML across ${
    guidePages.length + 1
  } pages`
);
if (inlinedCssBytes) {
  console.log(`Inlined ${(inlinedCssBytes / 1024).toFixed(1)} KB of CSS per page`);
}
console.log(`Sitemap and robots.txt generated for ${siteUrl}`);
