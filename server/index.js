import compression from 'compression';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chessContent } from '../client/src/data/chessContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 4000;
const distDir = path.resolve(__dirname, '../client/dist');
const indexFile = path.join(distDir, 'index.html');
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use(express.json({ limit: '16kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  next();
});

function requestOrigin(req) {
  if (siteUrl) return siteUrl;
  return `${req.protocol}://${req.get('host')}`;
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(
    `User-agent: *\nAllow: /\n\nSitemap: ${requestOrigin(req)}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${requestOrigin(req)}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
  );
});

app.get('/api/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ ok: true, service: 'the-64-squares-api', uptime: process.uptime() });
});

app.get('/api/content', (_req, res) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=300, stale-while-revalidate=86400'
  );
  res.json(chessContent);
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(
  express.static(distDir, {
    index: false,
    setHeaders(res, filePath) {
      const relative = path.relative(distDir, filePath);
      if (relative.startsWith(`assets${path.sep}`)) {
        res.setHeader(
          'Cache-Control',
          'public, max-age=31536000, immutable'
        );
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    },
  })
);

app.get('*', (req, res, next) => {
  // Never answer a missing file with the HTML app and a 200.
  if (path.extname(req.path)) return next();

  // Only HTML navigation gets the single-page app.
  if (!req.accepts('html')) return next();

  if (!fs.existsSync(indexFile)) {
    res
      .status(503)
      .type('text/plain')
      .send('Client build not found. Run "npm run build" from the project root.');
    return;
  }

  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(indexFile, (error) => {
    if (error) next(error);
  });
});

app.use((req, res) => {
  res.status(404).type('text/plain').send('Not found');
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (res.headersSent) return;
  res.status(500).type('text/plain').send('Server error');
});

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`The 64 Squares API + site running at http://localhost:${port}`);
  });
}

export default app;
