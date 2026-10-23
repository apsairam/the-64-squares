import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const size of [{width:1280,height:800},{width:1024,height:768},{width:1440,height:900}]) {
  const page = await browser.newPage({ viewport: size });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  console.log(size, await page.evaluate(() => {
    const rect = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) }; };
    return { progress: rect('.lesson__progress'), cue: rect('.lesson__scroll-cue'), frame: rect('.lesson__frame.is-active') };
  }));
  await page.close();
}
await browser.close();
