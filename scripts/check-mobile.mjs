import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);
console.log(await page.locator('.lesson__desc').first().innerText());
await page.screenshot({ path: 'shots/check-mobile-hero.png' });
await browser.close();
