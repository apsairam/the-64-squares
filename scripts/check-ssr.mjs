import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log(await page.evaluate(() => ({
  title: document.title,
  h1: [...document.querySelectorAll('h1')].map((el) => el.textContent.trim()),
  h2: document.querySelectorAll('h2').length,
  rootChildren: document.getElementById('root').children.length,
  bodyTextLength: document.body.innerText.length,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  metaDescription: document.querySelector('meta[name="description"]')?.content,
  fonts: document.fonts.status,
})));
console.log('errors:', errors.slice(0, 20));
await browser.close();
