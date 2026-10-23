import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const [label, viewport, mobile] of [['desktop', { width: 1440, height: 1000 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const read = () => page.evaluate(() => {
    const rect = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), pos: getComputedStyle(el).position }; };
    return { scrollY: Math.round(window.scrollY), lesson: rect('.lesson'), pin: rect('.lesson__pin'), progress: rect('.lesson__progress'), content: rect('#main-content'), learn: rect('#learn'), header: rect('.site-header'), cls: document.querySelector('.lesson')?.className };
  });
  console.log(label, 'top', await read());
  const learnTop = await page.evaluate(() => document.getElementById('main-content').offsetTop);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), learnTop);
  await page.waitForTimeout(700);
  console.log(label, 'content boundary', await read());
  await page.screenshot({ path: `shots/measure-${label}-boundary.png` });
  await page.close();
}
await browser.close();
