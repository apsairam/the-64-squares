import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [name, viewport, mobile] of [['desktop-final', { width: 1440, height: 1000 }, false], ['mobile-final', { width: 390, height: 844 }, true]]) {
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/final-${name}-hero.png` });
  await page.close();
}
await browser.close();
