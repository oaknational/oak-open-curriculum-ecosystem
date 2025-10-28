import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const ARTIFACT_DIR = path.resolve('apps/oak-open-curriculum-semantic-search/test-artifacts');

const breakpoints = {
  xs: { width: 360, height: 820 },
  md: { width: 800, height: 900 },
  lg: { width: 1200, height: 900 },
  xl: { width: 1380, height: 900 },
};

const scenarios = [
  {
    name: 'search-fixtures-success',
    url: '/search',
    cookie: 'on',
    viewports: ['xs', 'md', 'lg', 'xl'],
  },
  {
    name: 'search-fixtures-empty',
    url: '/search',
    cookie: 'empty',
    viewports: ['md'],
  },
  {
    name: 'search-structured-variant',
    url: '/structured_search',
    cookie: 'on',
    viewports: ['md', 'lg'],
  },
  {
    name: 'search-natural-variant',
    url: '/natural_language_search',
    cookie: 'on',
    viewports: ['md', 'lg'],
  },
  {
    name: 'admin-fixtures-success',
    url: '/admin',
    cookie: 'on',
    viewports: ['md', 'lg'],
  },
  {
    name: 'admin-fixtures-error',
    url: '/admin',
    cookie: 'error',
    viewports: ['md'],
  },
];

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function captureScenario(browser, scenario) {
  const results = [];
  for (const key of scenario.viewports) {
    const viewport = breakpoints[key];
    const context = await browser.newContext({ viewport });
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: scenario.cookie,
        url: BASE_URL,
      },
    ]);
    const page = await context.newPage();
    await page.goto(`${BASE_URL}${scenario.url}`, { waitUntil: 'networkidle' });

    const fileName = `${scenario.name}-${key}.png`;
    const filePath = path.join(ARTIFACT_DIR, fileName);
    await page.screenshot({ path: filePath, fullPage: true });

    const layoutInfo = await extractLayoutInfo(page, scenario.name);
    results.push({ scenario: scenario.name, viewport: key, screenshot: fileName, layoutInfo });
    await context.close();
  }
  return results;
}

async function extractLayoutInfo(page, scenarioName) {
  return page.evaluate((name) => {
    const info = {};
    const hero = document.querySelector('[data-testid="search-hero"]');
    const controls = document.querySelector('[aria-label="Search controls"]');
    if (hero && controls) {
      const heroRect = hero.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();
      info.heroTop = Math.round(heroRect.top);
      info.controlsTop = Math.round(controlsRect.top);
      info.controlsAboveHero = controlsRect.top < heroRect.top;
    }

    const skipNav = document.querySelector('nav[aria-label="Skip links"]');
    if (skipNav) {
      info.skipLinks = Array.from(skipNav.querySelectorAll('a')).map(
        (link) => link.textContent?.trim() ?? '',
      );
    }

    const heroCopy = document.querySelector('[data-testid="search-hero"] p');
    if (heroCopy) {
      info.primaryHeroCopy = heroCopy.textContent?.trim();
    }

    if (name.startsWith('admin')) {
      const radios = Array.from(document.querySelectorAll('input[name="search-fixture-mode"]'));
      info.adminRadios = radios.map((radio) => ({
        value: radio.getAttribute('value'),
        checked: radio.checked,
        label: radio.closest('label')?.textContent?.trim() ?? '',
      }));
      const notice = document.querySelector('main p[aria-live="polite"]');
      if (notice) {
        info.adminNotice = notice.textContent?.trim();
      }
    }

    const resultsGrid = document.querySelector('[data-testid="search-results-grid"]');
    if (resultsGrid) {
      info.resultsCount = resultsGrid.childElementCount;
    }

    const instruction = document.querySelector('main section[aria-live="polite"] p');
    if (instruction) {
      info.primaryInstruction = instruction.textContent?.trim();
    }

    return info;
  }, scenarioName);
}

async function main() {
  await ensureDir(ARTIFACT_DIR);
  const browser = await chromium.launch();
  const collected = [];
  for (const scenario of scenarios) {
    const entries = await captureScenario(browser, scenario);
    collected.push(...entries);
  }
  await browser.close();

  await writeFile(
    path.join(ARTIFACT_DIR, 'artifact-summary.json'),
    JSON.stringify(collected, null, 2),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
