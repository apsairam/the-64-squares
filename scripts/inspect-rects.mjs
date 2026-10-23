import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log(await page.evaluate(() => {
  const rect = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) }; };
  return { progress: rect('.lesson__progress'), nav: rect('.lesson__nav'), readout: rect('.lesson__readout'), cue: rect('.lesson__scroll-cue'), overlay: rect('.lesson__overlay'), frame: rect('.lesson__frame.is-active') };
}));
await browser.close();
