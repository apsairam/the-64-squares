import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
const info = await page.evaluate(() => {
  const s = document.querySelector('.lesson__scrim');
  const lesson = document.querySelector('.lesson');
  const pin = document.querySelector('.lesson__pin');
  const board = document.querySelector('.lesson__board-wrap');
  const r = (el)=>{const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}};
  return { scrollY: Math.round(scrollY), lessonClass: lesson.className, lesson: r(lesson), pin: r(pin), board: r(board), scrim: s ? { rect:r(s), display:getComputedStyle(s).display, opacity:getComputedStyle(s).opacity, z:getComputedStyle(s).zIndex, bg:getComputedStyle(s).backgroundImage.slice(0,220) } : null, overlay: r(document.querySelector('.lesson__overlay')), frame: getComputedStyle(document.querySelector('.lesson__frame')).opacity };
});
console.log(info);
await page.screenshot({ path: 'shots/debug-scrim.png' });
await browser.close();
