import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
for (let i=0;i<8;i++) {
  await page.waitForTimeout(500);
  console.log(await page.evaluate(() => {
    const pawn = document.querySelector('[data-piece-id="w-p-e2"]');
    const cs = getComputedStyle(pawn);
    return { t: Date.now() % 100000, top: cs.top, step: document.querySelector('.lesson__count')?.textContent.trim(), y: window.scrollY, hasGsap: !!window.gsap, hasST: !!(window.ScrollTrigger) };
  }));
}
await browser.close();
