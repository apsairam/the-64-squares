import fs from 'node:fs';
import { chromium } from 'playwright';

fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const sections = [
  'learn',
  'faq',
  'chaturanga',
  'shatranj',
  'immortal',
  'laws',
  'pieces',
  'phases',
  'legacy',
  'sources',
  'challenge',
];

for (const [name, viewport, mobile] of [
  ['desktop', { width: 1440, height: 1000 }, false],
  ['wide', { width: 1920, height: 1080 }, false],
  ['mobile', { width: 390, height: 844 }, true],
  ['small', { width: 360, height: 640 }, true],
]) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    return document.fonts?.ready;
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/preview-${name}-hero.png` });

  if (!mobile) {
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `shots/preview-${name}-step1.png` });
  }

  const ticks = page.locator('.tick');
  const ticksVisible = await ticks.last().isVisible().catch(() => false);
  if (ticksVisible) {
    await ticks.last().click();
    await page.waitForTimeout(1700);
  } else {
    for (let index = 0; index < 7; index += 1) {
      await page.locator('.lesson__arrow').last().click();
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `shots/preview-${name}-mate.png` });

  for (const section of sections) {
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, section);
    await page.waitForTimeout(950);
    await page.screenshot({ path: `shots/preview-${name}-${section}.png` });
  }

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/preview-${name}-footer.png` });

  if (errors.length) console.log(name, errors);
  await context.close();
}

await browser.close();
