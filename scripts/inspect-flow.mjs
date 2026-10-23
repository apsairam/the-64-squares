import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const content = document.getElementById('main-content');
  return { contentTop: content.getBoundingClientRect().top + window.scrollY, lessonHeight: document.querySelector('.lesson').getBoundingClientRect().height, innerHeight: window.innerHeight, bodyHeight: document.body.scrollHeight };
});
console.log(info);
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
await page.waitForTimeout(900);
console.log('step1', await page.evaluate(() => ({
  step: document.querySelector('.lesson__count')?.textContent.trim(),
  move: document.querySelector('.lesson__move')?.textContent,
  header: document.querySelector('.site-header').className,
  scrollY: window.scrollY,
})));
await page.screenshot({ path: 'shots/check-step1.png' });
await page.evaluate(() => { const c = document.getElementById('main-content'); window.scrollTo({ top: c.getBoundingClientRect().top + window.scrollY + 20, behavior: 'instant' }); });
await page.waitForTimeout(900);
console.log('content', await page.evaluate(() => ({
  header: document.querySelector('.site-header').className,
  headerVisibility: getComputedStyle(document.querySelector('.site-header')).visibility,
  scrollY: window.scrollY,
  contentTop: Math.round(document.getElementById('main-content').getBoundingClientRect().top),
})));
await page.screenshot({ path: 'shots/check-content.png' });
await browser.close();
