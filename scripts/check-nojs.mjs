import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [label, viewport, mobile] of [['desktop', { width: 1440, height: 1000 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:4000/', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const bodyText = await page.locator('body').innerText();
  console.log(label, {
    learn: bodyText.includes('The rules, without the mystery'),
    faq: bodyText.includes('Before your first move'),
    immortal: bodyText.includes('Anderssen'),
    sources: bodyText.includes('Where this comes from'),
    length: bodyText.length,
  });
  await page.screenshot({ path: `shots/nojs-${label}.png`, fullPage: false });
  await context.close();
}
await browser.close();
