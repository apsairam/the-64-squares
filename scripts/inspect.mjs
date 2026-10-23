import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: 'shots/check-hero-top.png' });
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.55, behavior: 'instant' }));
await page.waitForTimeout(900);
console.log(await page.evaluate(() => ({
  header: document.querySelector('.site-header').className,
  headerVisibility: getComputedStyle(document.querySelector('.site-header')).visibility,
  step: document.querySelector('.lesson__count')?.textContent,
  move: document.querySelector('.lesson__move')?.textContent,
})));
await page.screenshot({ path: 'shots/check-hero-first-move.png' });
await browser.close();
