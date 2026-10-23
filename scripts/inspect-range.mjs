import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
for (const y of [850, 875, 900, 950, 1000, 1050, 1100, 1150, 1200, 1300, 1400, 1500]) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  await page.waitForTimeout(800);
  console.log(y, await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('[data-piece-id="w-p-e2"]'));
    return { top: cs.top, step: document.querySelector('.lesson__count')?.textContent.trim(), move: document.querySelector('.lesson__move')?.textContent };
  }));
}
await browser.close();
