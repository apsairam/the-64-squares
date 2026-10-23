import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'client', 'src', 'assets', 'pieces');
const shotsDir = path.join(root, 'shots');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(shotsDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const filePath = path.join(root, urlPath === '/' ? '/index.html' : urlPath);
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] ?? 'application/octet-stream',
    });
    response.end(data);
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [];
page.on('console', (message) => {
  if (
    message.type() === 'error' &&
    !message.text().includes('Failed to load resource')
  ) {
    errors.push(message.text());
  }
});
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => {
  if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
    errors.push(`${response.status()} ${response.url()}`);
  }
});

try {
  await page.goto(`http://127.0.0.1:${port}/scripts/pieces/gen.html`, {
    waitUntil: 'load',
  });
  await page.waitForFunction(() => window.__ready === true, null, {
    timeout: 30000,
  });

  const result = await page.evaluate(() => window.renderAll(), null, {
    timeout: 180000,
  });

  if (errors.length) {
    throw new Error(`Generator errors:\n${errors.join('\n')}`);
  }

  const sheets = {};
  const setStills = {};
  for (const [type, dataUrl] of Object.entries(result.sheets)) {
    const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(outDir, `${type}.webp`), buffer);
    sheets[type] = `${(buffer.length / 1024).toFixed(0)} KB`;
  }
  for (const [type, dataUrl] of Object.entries(result.setStills)) {
    const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(outDir, `set-${type}.webp`), buffer);
    setStills[type] = `${(buffer.length / 1024).toFixed(0)} KB`;
  }

  const preview = Buffer.from(result.preview.split(',')[1], 'base64');
  fs.writeFileSync(path.join(shotsDir, 'pieces-preview.png'), preview);

  console.log(
    JSON.stringify(
      {
        frames: result.frames,
        cell: [result.cellWidth, result.cellHeight],
        sheets,
        setStills,
        preview: 'shots/pieces-preview.png',
        errors,
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
