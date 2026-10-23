import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
await page.waitForTimeout(1600);
console.log(await page.evaluate(() => {
  const pawn = document.querySelector('[data-piece-id="w-p-e2"]');
  const cs = getComputedStyle(pawn);
  return { left: cs.left, top: cs.top, transform: cs.transform, step: document.querySelector('.lesson__count')?.textContent.trim(), scrollY: window.scrollY };
}));
await page.screenshot({ path: 'shots/check-step1-settled.png' });
await browser.close();
