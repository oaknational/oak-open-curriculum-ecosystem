/*
 * Re-runnable 320px reflow measurement of the LIVE running demo (WCAG 1.4.10): every route's
 * document + body scrollWidth must fit the 320 CSS px viewport, INCLUDING the header disclosure's
 * open state. This is the §E reflow gate's tool-of-record (item 8's demo-wide bar), conserved from
 * the styling lane's slice verification (Peregrine, 2026-07-02) into the capture-tool family.
 *
 * HYDRATION HONESTY (the vacuous-click cure — keep this loop): a click on the pre-hydration SSR
 * toggle has no handler and silently does nothing, which makes a naive "menu-open OK" measurement
 * vacuous. The loop clicks UNTIL aria-expanded actually flips (bounded attempts), so an unhydrated
 * page fails loud instead of passing an open-state check that never opened anything. Sibling of
 * capture-live-demo.ts's hidden-attribute hydration witness: that tool proves capture-side
 * hydration, this one proves interaction-side hydration.
 *
 * CORRECTNESS MECHANISM (tools/ convention, no unit test): the run is self-validating — any route
 * overflow, or a menu that never opens, exits non-zero with the failing measurement printed.
 *
 * PREREQUISITE: the demo dev server must already be running (this tool connects, never starts).
 * The default base host is `localhost`, NOT `127.0.0.1` — next dev blocks cross-origin dev
 * resources from 127.0.0.1, so hydration chunks never load there (team finding, 2026-07-02).
 *
 * USAGE:
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:measure-320
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:measure-320 -- --base http://localhost:3011 --routes /,/course
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:measure-320 -- --width 360   # measure another breakpoint
 *   # direct form, from the repo root:
 *   tsx demos/oak-curriculum-hub/tools/measure-320.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { ok, err, type Result } from '@oaknational/result';

import {
  argValue,
  HYDRATION_GATED_ROUTES,
  MENU_TOGGLE_NAME,
  overflows,
  resolveRoutes,
  resolveWidth,
} from './measure-checks';
import { describeThrown, runTool, stripTrailing } from '@oaknational/fidelity-review/support';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(TOOLS_DIR, '..', 'demo-evidence');

interface WidthMetrics {
  doc: number;
  body: number;
  inner: number;
}

async function measureRoute(
  page: Page,
  base: string,
  route: string,
  hydrated: boolean,
): Promise<WidthMetrics> {
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  if (hydrated && HYDRATION_GATED_ROUTES.has(route)) {
    // Deterministic hydrated state: the gates add [hidden] attributes on mount.
    await page
      .waitForFunction(() => document.querySelectorAll('[hidden]').length > 0, undefined, {
        timeout: 10000,
      })
      .catch(() => {
        process.stderr.write(`${route}: hydration witness never appeared — check the base host\n`);
      });
  }
  await page.waitForTimeout(400);
  return page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    inner: globalThis.innerWidth,
  }));
}

interface PassOptions {
  js: boolean;
  label: string;
  base: string;
  routes: readonly string[];
  width: number;
}

/** One measurement pass over every route in a single browser context. The NO-JS pass measures the
 *  SSR fallback (a designed user state — progressive enhancement); the HYDRATED pass measures the
 *  enhanced state. Both must be reflow-clean: a failure in either is a real WCAG 1.4.10 failure. */
async function measurePass(
  browser: Browser,
  { js, label, base, routes, width }: PassOptions,
): Promise<boolean> {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
    javaScriptEnabled: js,
  });
  const page = await ctx.newPage();
  let failed = false;
  try {
    for (const route of routes) {
      const m = await measureRoute(page, base, route, js);
      const bad = overflows(m.doc, m.body, m.inner);
      if (bad) {
        failed = true;
      }
      process.stdout.write(
        `${route} [${label}]: docScrollW=${m.doc} bodyScrollW=${m.body} innerW=${m.inner} -> ${bad ? 'OVERFLOW' : 'OK'}\n`,
      );
    }
  } finally {
    await ctx.close();
  }
  return failed;
}

/** Click the disclosure toggle until aria-expanded flips (bounded) — the vacuous-click cure. */
async function openMenuHydrated(page: Page): Promise<boolean> {
  const toggle = page.getByRole('button', { name: MENU_TOGGLE_NAME });
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await toggle.click();
    await page.waitForTimeout(300);
    if ((await toggle.getAttribute('aria-expanded')) === 'true') {
      return true;
    }
  }
  return false;
}

/** Measure + capture the OPEN menu state, then close it and capture again. True on overflow. */
async function measureOpenMenu(page: Page, width: number): Promise<boolean> {
  const open = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    inner: globalThis.innerWidth,
  }));
  const bad = open.doc > open.inner;
  process.stdout.write(
    `/ (menu open) [hydrated]: docScrollW=${open.doc} innerW=${open.inner} -> ${bad ? 'OVERFLOW' : 'OK'}\n`,
  );
  await page.screenshot({ path: path.join(OUT_DIR, `home-live-${width}-menu-open.png`) });
  await page.getByRole('button', { name: MENU_TOGGLE_NAME }).click();
  await page.screenshot({ path: path.join(OUT_DIR, `home-live-${width}.png`) });
  return bad;
}

/** Header disclosure open state (home page): hydrated by definition — proven via the
 *  click-until-flipped loop, then measured + captured. True when the check failed. */
async function measureMenuOpenState(
  browser: Browser,
  base: string,
  width: number,
): Promise<boolean> {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  let failed: boolean;
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  if (await openMenuHydrated(page)) {
    failed = await measureOpenMenu(page, width);
  } else {
    process.stderr.write(
      'menu never opened — hydration never attached the handler (check the base host)\n',
    );
    failed = true;
  }
  await ctx.close();
  return failed;
}

async function main(): Promise<Result<void, string>> {
  const argv = process.argv.slice(2);
  const widthRes = resolveWidth(argv);
  if (!widthRes.ok) {
    return err(`MEASURE FAIL: ${describeThrown(widthRes.error)}`);
  }
  const width = widthRes.value;
  const base = stripTrailing(
    argValue(argv, '--base') ?? process.env.BASE_URL ?? 'http://localhost:3010',
    '/',
  );
  const routes = resolveRoutes(argv);

  process.stdout.write(
    `base = ${base}; viewport CSS width = ${width}px; routes = ${routes.join(', ')}\n`,
  );
  const browser = await chromium.launch({ headless: true });
  let failed = false;
  try {
    // Two deterministic passes: the SSR fallback first (no JS — nothing to race),
    // then the hydrated state (with the gating witness awaited where it applies).
    failed =
      (await measurePass(browser, { js: false, label: 'no-js', base, routes, width })) || failed;
    failed =
      (await measurePass(browser, { js: true, label: 'hydrated', base, routes, width })) || failed;
    failed = (await measureMenuOpenState(browser, base, width)) || failed;
  } finally {
    await browser.close();
  }

  if (failed) {
    return err(`REFLOW FAILURE at ${width}px`);
  }
  process.stdout.write(`ALL ROUTES REFLOW CLEAN AT ${width}\n`);
  return ok(undefined);
}

const invokedPath = process.argv.at(1);
if (invokedPath !== undefined && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await runTool(main, (error) => `MEASURE FAIL: ${describeThrown(error)}`);
}
