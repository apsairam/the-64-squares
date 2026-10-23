import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.addInitScript(() => {
  window.__imgLoads = [];
  const Orig = window.Image;
  const srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  window.Image = function(...args) {
    const img = new Orig(...args);
    Object.defineProperty(img, 'src', {
      set(value) {
        window.__imgLoads.push({ value: String(value), stack: String(new Error().stack).split('\n').slice(1, 5).join(' | ') });
        srcDesc.set.call(img, value);
      },
      get() { return srcDesc.get.call(img); },
    });
    return img;
  };
  window.Image.prototype = Orig.prototype;
});
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const loads = await page.evaluate(() => window.__imgLoads);
console.log(loads);
console.log(await page.evaluate(() => [...document.querySelectorAll('.chapter__piece')].map(el => ({ cls: el.className, rect: (() => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) }; })() }))));
await browser.close();
