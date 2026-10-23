import fs from 'node:fs';
import { chromium } from 'playwright';

fs.mkdirSync('shots', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function shoot(viewport, name, isMobile = false) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: isMobile ? 2 : 1,
    isMobile,
    hasTouch: isMobile,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);

  const frames = [
    ['hero', 0],
    ['chaturanga', 1.4],
    ['immortal', 3.4],
    ['legacy', 6.9],
  ];

  for (const [label, factor] of frames) {
    await page.evaluate(
      (value) =>
        window.scrollTo({ top: window.innerHeight * value, behavior: 'instant' }),
      factor
    );
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `shots/${name}-frame-${label}.png` });
  }

  for (const section of [
    'chaturanga',
    'immortal',
    'laws',
    'pieces',
    'phases',
    'legacy',
    'challenge',
  ]) {
    const target = await page.evaluate(
      (id) =>
        document.querySelector(`#${id}`).getBoundingClientRect().top +
        window.scrollY,
      section
    );
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      target
    );
    await page.waitForTimeout(900);
    await page
      .waitForFunction(
        (id) => {
          const canvas = document.querySelector(
            `#${id} .chapter__piece canvas`
          );
          const image = document.querySelector(
            `#${id} .chapter__piece img`
          );
          const swords = document.querySelector(
            `#${id} .challenge__swords img`
          );
          return (
            (canvas && canvas.dataset.ready === 'true') ||
            (image && image.complete && image.naturalWidth > 0) ||
            (swords && swords.complete && swords.naturalWidth > 0)
          );
        },
        section,
        { timeout: 8000 }
      )
      .catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: `shots/${name}-section-${section}.png` });
  }

  await page.locator('.piece-grid').scrollIntoViewIfNeeded();
  await page
    .waitForFunction(
      () => {
        const pieces = [
          ...document.querySelectorAll('#pieces .piece-card__piece img'),
        ];
        return (
          pieces.length === 6 &&
          pieces.every((image) => image.complete && image.naturalWidth > 0)
        );
      },
      null,
      { timeout: 10000 }
    )
    .catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({ path: `shots/${name}-pieces-detail.png` });

  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
  );
  await page.waitForTimeout(800);
  await page.screenshot({ path: `shots/${name}-footer.png` });

  await context.close();
}

await shoot({ width: 1920, height: 1080 }, 'wide');
await shoot({ width: 1440, height: 1000 }, 'desktop');
await shoot({ width: 390, height: 844 }, 'mobile', true);

async function shootCleanBoards() {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);

  await page.evaluate(() => {
    ['.lesson__scrim', '.lesson__overlay'].forEach(
      (selector) => {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
      }
    );
  });

  await page.screenshot({ path: 'shots/board-1920x1080-start.png' });

  await page.evaluate(() =>
    window.scrollTo({
      top: window.innerHeight * 6.9,
      behavior: 'instant',
    })
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shots/board-1920x1080-mate.png' });

  await context.close();
}

await shootCleanBoards();

await browser.close();
console.log('screenshots ready');
