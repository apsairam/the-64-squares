import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const appHtml = render();
let html = fs.readFileSync(indexPath, 'utf8');

const absoluteUrl = `${siteUrl}/`;
const socialImage = `${siteUrl}/og-image.png`;
const headTags = [
  `<link rel="canonical" href="${absoluteUrl}" />`,
  `<meta property="og:url" content="${absoluteUrl}" />`,
  `<meta property="og:image" content="${socialImage}" />`,
  `<meta name="twitter:image" content="${socialImage}" />`,
].join('\n    ');
html = html.replace('</head>', `    ${headTags}\n  </head>`);

// A single-page prerender does not need a separate render-blocking CSS request.
// Inline the extracted stylesheet so the pre-rendered hero is styled on the
// first paint, including when JavaScript is still loading.
let inlinedCssBytes = 0;
html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/i, (tag) => {
  const href = tag.match(/href="([^"]+\.css)"/);
  if (!href) return tag;
  const cssPath = path.join(distDir, href[1].replace(/^\//, ''));
  if (!fs.existsSync(cssPath)) return tag;
  const css = fs.readFileSync(cssPath, 'utf8');
  inlinedCssBytes = Buffer.byteLength(css);
  return `<style>${css}</style>`;
});

const rootPattern = /<div id="root"><\/div>/;
if (!rootPattern.test(html)) {
  throw new Error('Could not find an empty #root in the client build.');
}
html = html.replace(rootPattern, `<div id="root">${appHtml}</div>`);
fs.writeFileSync(indexPath, html);

const ssrAssets = path.join(ssrDir, 'assets');
const clientAssets = path.join(distDir, 'assets');
if (fs.existsSync(ssrAssets)) {
  fs.mkdirSync(clientAssets, { recursive: true });
  for (const file of fs.readdirSync(ssrAssets)) {
    const source = path.join(ssrAssets, file);
    const target = path.join(clientAssets, file);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(source, target);
    }
  }
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

console.log(
  `Prerendered ${(appHtml.length / 1024).toFixed(1)} KB of HTML into dist/index.html`
);
if (inlinedCssBytes) {
  console.log(`Inlined ${(inlinedCssBytes / 1024).toFixed(1)} KB of critical CSS`);
}
console.log(`Sitemap and robots.txt generated for ${siteUrl}`);
