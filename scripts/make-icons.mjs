import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await page.setContent(`
<!doctype html><html><body style="margin:0;background:#080808;display:grid;place-items:center;width:180px;height:180px">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="160" height="160" aria-hidden="true">
<rect width="64" height="64" fill="#080808"/>
<rect x="9.5" y="9.5" width="45" height="45" fill="none" stroke="#f5f5f2" stroke-width="1.5"/>
<rect x="10" y="10" width="22" height="22" fill="#f5f5f2"/>
<rect x="32" y="32" width="22" height="22" fill="#f5f5f2"/>
<rect x="32" y="10" width="22" height="22" fill="#1a1a1a"/>
<rect x="10" y="32" width="22" height="22" fill="#1a1a1a"/>
</svg></body></html>
`);
await page.screenshot({ path: 'client/public/apple-touch-icon.png' });
await browser.close();
console.log('apple-touch-icon.png written');
