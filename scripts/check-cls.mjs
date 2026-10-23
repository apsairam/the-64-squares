import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const blockFonts of [false, true]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  if (blockFonts) {
    await page.route(/inter-latin.*\.woff2/, (route) => route.abort());
  }
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log(
    blockFonts ? 'fallback' : 'inter',
    await page.evaluate(() => {
      const desc = document.querySelector('.lesson__desc');
      const board = document.querySelector('.board-frame');
      const rect = (el) => {
        const box = el.getBoundingClientRect();
        return {
          top: Math.round(box.top),
          bottom: Math.round(box.bottom),
          height: Math.round(box.height),
        };
      };
      return {
        desc: rect(desc),
        descLines: Math.round(
          desc.getBoundingClientRect().height /
            parseFloat(getComputedStyle(desc).lineHeight)
        ),
        family: getComputedStyle(desc).fontFamily,
        board: rect(board),
        content: rect(document.querySelector('#main-content')),
      };
    })
  );
  await page.close();
}

await browser.close();
