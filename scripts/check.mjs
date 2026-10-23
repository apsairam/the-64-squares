import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.SITE_URL || 'http://localhost:4000';
const results = [];
const failures = [];

function check(name, condition, detail = '') {
  const ok = Boolean(condition);
  results.push({ name, ok, detail });
  if (!ok) failures.push({ name, detail });
}

function samePageLinksResolve(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((link) => link.getAttribute('href'))
      .filter((href) => href && href !== '#')
      .filter((href, index, all) => all.indexOf(href) === index)
      .map((href) => ({ href, exists: Boolean(document.querySelector(href)) }))
      .filter((item) => !item.exists)
  );
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

  const response = await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);

  check('desktop responds 200', response?.status() === 200, response?.status());
  check('prerendered content is present', (await page.locator('#root').innerText()).length > 5000);
  check('single h1', (await page.locator('h1').count()) === 1);
  check('eight lesson steps', (await page.locator('.tick').count()) === 8);
  check('full 64-square lesson board', (await page.locator('.lesson .square').count()) === 64);
  check('self-hosted fonts load', await page.evaluate(() => document.fonts.check('16px Inter') && document.fonts.check('16px "JetBrains Mono"')));
  check('no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  check('same-page links resolve', (await samePageLinksResolve(page)).length === 0);
  check('no console or page errors', errors.length === 0, errors.join(' | '));

  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  check('title names the site', /64 Squares/.test(title), title);
  check('description length', description?.length >= 120 && description?.length <= 160, description?.length);
  check('canonical URL', Boolean(canonical && canonical.startsWith(BASE)), canonical);

  await page.locator('.tick').last().click();
  await page.waitForTimeout(1500);
  const finalMove = await page.locator('.lesson__move').innerText();
  const finalCount = await page.locator('.lesson__count').innerText();
  check('final lesson step is reached', /Qxf7#/.test(finalMove), finalMove);
  check('lesson count reaches 08', /08/.test(finalCount), finalCount);
  check('mate square is marked', (await page.locator('.lesson .square.is-mate').count()) === 1);
  check('mated king is marked', (await page.locator('.piece.is-mated-king').count()) === 1);

  await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
  await page.waitForTimeout(600);
  const hiddenClass = await page.locator('.site-header').getAttribute('class');
  check('header hides inside the pinned lesson', /is-hidden/.test(hiddenClass || ''), hiddenClass);

  await page.evaluate(() => document.getElementById('learn').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(800);
  const headerClass = await page.locator('.site-header').getAttribute('class');
  const learnTop = await page.evaluate(() => Math.round(document.getElementById('learn').getBoundingClientRect().top));
  check('header returns at content', !/is-hidden/.test(headerClass || ''), headerClass);
  check('anchor lands at content top', Math.abs(learnTop) <= 1, learnTop);

  await page.locator('#faq details summary').first().click();
  await page.waitForTimeout(200);
  const openFaq = await page.locator('#faq details[open]').count();
  check('FAQ opens', openFaq >= 1, openFaq);

  await page.screenshot({ path: 'shots/check-desktop.png' });
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mobile = await mobileContext.newPage();
  const mobileErrors = [];
  mobile.on('console', (message) => {
    if (message.type() === 'error') mobileErrors.push(`console: ${message.text()}`);
  });
  mobile.on('pageerror', (error) => mobileErrors.push(`page: ${error.message}`));
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1200);

  check('mobile uses static lesson', /lesson--static/.test(await mobile.locator('.lesson').getAttribute('class')));
  const mobileContentTop = await mobile.evaluate(() => Math.round(document.getElementById('main-content').getBoundingClientRect().top));
  check('mobile content follows one-screen hero', mobileContentTop <= 844 + 40, mobileContentTop);
  check('mobile has no long pin spacer', await mobile.evaluate(() => document.querySelector('.lesson').getBoundingClientRect().height < window.innerHeight * 2));
  check('mobile no horizontal overflow', await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  check('mobile has no console errors', mobileErrors.length === 0, mobileErrors.join(' | '));
  check('44px lesson arrows', await mobile.locator('.lesson__arrow').first().evaluate((el) => el.getBoundingClientRect().height >= 44));

  await mobile.locator('.lesson__arrow').last().click();
  await mobile.waitForTimeout(500);
  check('mobile arrow advances lesson', /02/.test(await mobile.locator('.lesson__count').innerText()));

  await mobile.locator('.site-header__toggle').click();
  await mobile.waitForTimeout(200);
  check('mobile menu opens', (await mobile.locator('.site-header__toggle').getAttribute('aria-expanded')) === 'true');
  await mobile.screenshot({ path: 'shots/check-mobile.png' });
  await mobileContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1024, height: 900 },
    reducedMotion: 'reduce',
  });
  const reduced = await reducedContext.newPage();
  await reduced.goto(BASE, { waitUntil: 'networkidle' });
  await reduced.waitForTimeout(900);
  check('reduced motion uses static lesson', /lesson--static/.test(await reduced.locator('.lesson').getAttribute('class')));
  check('reduced motion has no pin spacer', await reduced.evaluate(() => document.querySelector('.lesson').getBoundingClientRect().height < window.innerHeight * 2));
  await reducedContext.close();

  const noJsContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: false,
  });
  const noJs = await noJsContext.newPage();
  await noJs.goto(BASE, { waitUntil: 'load' });
  const noJsText = await noJs.locator('body').innerText();
  check('no-JS content is readable', noJsText.includes('The rules, without the mystery') && noJsText.includes('Before your first move') && noJsText.includes('Where this comes from'));
  await noJsContext.close();

  const health = await fetch(`${BASE}/api/health`);
  const healthJson = await health.json();
  check('API health', health.ok && healthJson.ok === true, healthJson.service);
  const robots = await fetch(`${BASE}/robots.txt`);
  const robotsText = await robots.text();
  check('robots.txt', robots.ok && robotsText.includes('Sitemap:'));
  const sitemap = await fetch(`${BASE}/sitemap.xml`);
  const sitemapText = await sitemap.text();
  check('sitemap.xml', sitemap.ok && sitemapText.includes('<urlset') && sitemapText.includes('<loc>'));
  const missing = await fetch(`${BASE}/missing-${Date.now()}.js`);
  check('missing asset returns 404', missing.status === 404, missing.status);

  fs.mkdirSync('shots', { recursive: true });
} finally {
  await browser.close();
}

for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
}
console.log(`\n${results.length - failures.length}/${results.length} checks passed`);

if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exitCode = 1;
}
