import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
console.log(await page.evaluate(() => {
  const el = document.querySelector('.lesson__scroll-cue');
  if (!el) return 'missing';
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { text: el.textContent, cls: el.className, display: cs.display, opacity: cs.opacity, visibility: cs.visibility, zIndex: cs.zIndex, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, scrollY: window.scrollY };
}));
await page.screenshot({ path: 'shots/check-cue.png' });
await browser.close();
