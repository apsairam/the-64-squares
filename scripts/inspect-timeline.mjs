import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
for (const y of [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 7999]) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  await page.waitForTimeout(700);
  const data = await page.evaluate(() => {
    const ids = ['w-p-e2','w-p-d2','w-p-f2','w-n-g1','w-b-f1','w-q-d1','b-p-e7','b-p-c6'];
    const out = {};
    for (const id of ids) { const el = document.querySelector(`[data-piece-id="${id}"]`); if (el) { const cs = getComputedStyle(el); out[id] = [cs.left, cs.top, cs.opacity]; } }
    return { step: document.querySelector('.lesson__count')?.textContent.trim(), move: document.querySelector('.lesson__move')?.textContent, out };
  });
  console.log('scroll', y, JSON.stringify(data));
}
await browser.close();
