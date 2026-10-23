import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [label, viewport, mobile] of [['desktop', { width: 1440, height: 1000 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.getElementById('learn').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(700);
  console.log(label, await page.evaluate(() => {
    const r = (id) => { const el = document.getElementById(id); const b = el.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
    return { scrollY: Math.round(scrollY), learn: r('learn'), content: r('main-content'), header: document.querySelector('.site-header')?.className, firstHeadingTop: Math.round(document.querySelector('#learn h2').getBoundingClientRect().top) };
  }));
  await page.screenshot({ path: `shots/check-${label}-learn-anchor.png` });
  await page.close();
}
await browser.close();
