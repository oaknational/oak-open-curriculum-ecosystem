/**
 * The visual probe: rendered proof for design verdicts on demand
 * (PDR-138 / DDR-011; owner-directed 2026-08-13 — "record and automate
 * the visual probe, we are going to need it many thousands of times").
 *
 * Captures, per route: a page render (viewport or full-page), and — when
 * interaction steps are requested — the post-interaction render plus the
 * DOM-fact echo (`document.activeElement`) in-band on stdout, so pixels
 * and DOM corroborate each other. Artefacts are ephemeral proof: they
 * default to a session temp directory and are regenerated, never
 * committed.
 *
 * The probe never manages a server (singleton discipline stays with the
 * caller): it targets this workspace's deterministic per-worktree origin
 * by default and reports, naming the start command, when nothing serves
 * there.
 *
 *   pnpm tool:visual-probe --route /identity-switchboard --tabs 1
 *   pnpm tool:visual-probe --route /a --route /b --viewport 320x900
 */
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { chromium } from '@playwright/test';
import type { Page } from '@playwright/test';
import { err, isErr, ok, type Result } from '@oaknational/result';

import { assertCanonicalWidth } from './measurement-widths';
import { SHOWCASE_ORIGIN, SHOWCASE_PORT } from './showcase-origin';

interface ProbeOptions {
  readonly routes: string[];
  origin: string;
  outDir: string;
  viewport: { readonly width: number; readonly height: number };
  fullPage: boolean;
  tabs: number;
  readySelector: string;
}

const USAGE = `visual-probe --route <path> [--route <path> ...]
  [--origin <url>]      target origin (default: this worktree's ${SHOWCASE_ORIGIN})
  [--out <dir>]         artefact directory (default: a session temp dir)
  [--viewport <WxH>]    viewport in CSS px (default: 1280x900); the width
                        must be a canonical measurement width (DDR-009)
  [--full-page]         capture the full scroll height, not the viewport
  [--tabs <n>]          press Tab n times, then capture the focus state
                        and echo document.activeElement (default: 0)
  [--ready <selector>]  render-complete mark to await (default: h1)
The target must already be serving. For this workspace:
  pnpm build && pnpm exec next start -p ${SHOWCASE_PORT}`;

type FlagSetter = (value: string, options: ProbeOptions) => Result<void, string>;

function setViewport(value: string, options: ProbeOptions): Result<void, string> {
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (match === null) {
    return err(`--viewport expects <width>x<height>, got "${value}"`);
  }
  // Proof renders are comparable only at the canonical measurement
  // widths (DDR-009 / DDR-011) — a free-hand width would label
  // non-comparable evidence as proof.
  const width = assertCanonicalWidth(Number(match[1]));
  if (isErr(width)) {
    return width;
  }
  options.viewport = { width: width.value, height: Number(match[2]) };
  return ok(undefined);
}

function setTabs(value: string, options: ProbeOptions): Result<void, string> {
  const tabs = Number(value);
  if (!Number.isInteger(tabs) || tabs < 0) {
    return err('--tabs expects a non-negative integer');
  }
  options.tabs = tabs;
  return ok(undefined);
}

const VALUE_FLAGS: Readonly<Record<string, FlagSetter>> = {
  '--route': (value, options) => {
    options.routes.push(value);
    return ok(undefined);
  },
  '--origin': (value, options) => {
    options.origin = value;
    return ok(undefined);
  },
  '--out': (value, options) => {
    options.outDir = value;
    return ok(undefined);
  },
  '--viewport': setViewport,
  '--tabs': setTabs,
  '--ready': (value, options) => {
    options.readySelector = value;
    return ok(undefined);
  },
};

function parseArgs(argv: readonly string[]): Result<ProbeOptions, string> {
  const options: ProbeOptions = {
    routes: [],
    origin: SHOWCASE_ORIGIN,
    outDir: join(tmpdir(), `visual-probe-${process.pid}`),
    viewport: { width: 1280, height: 900 },
    fullPage: false,
    tabs: 0,
    readySelector: 'h1',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i] ?? '';
    if (flag === '--full-page') {
      options.fullPage = true;
      continue;
    }
    const setter = VALUE_FLAGS[flag];
    i += 1;
    const value = argv[i];
    if (setter === undefined || value === undefined) {
      return err(`bad or valueless flag "${flag}"\n${USAGE}`);
    }
    const set = setter(value, options);
    if (isErr(set)) {
      return set;
    }
  }
  if (options.routes.length === 0) {
    return err(`at least one --route is required\n${USAGE}`);
  }
  return ok(options);
}

/** Filesystem-safe artefact stem for a route path. */
function routeStem(route: string): string {
  const stem = route.replaceAll(/[^a-z0-9]+/gi, '-').replaceAll(/^-|-$/g, '');
  return stem === '' ? 'root' : stem;
}

/** The DOM-fact echo: enough of activeElement to corroborate the pixels. */
async function activeElementFact(page: Page): Promise<string> {
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) {
      return 'none';
    }
    const id = active.id === '' ? '' : `#${active.id}`;
    const cls = active.className === '' ? '' : `.${active.className.replaceAll(' ', '.')}`;
    return `${active.tagName.toLowerCase()}${id}${cls}`;
  });
}

async function probeRoute(
  page: Page,
  route: string,
  options: ProbeOptions,
): Promise<Result<void, string>> {
  const response = await page.goto(`${options.origin}${route}`);
  // A non-OK document must never pass as proof: a 404 page carries an h1
  // and a body activeElement, so without this check it reads exactly like
  // a rendered page with dead keyboard access (worked failure 2026-08-13:
  // a 404 was mistaken for a reproduced defect).
  if (response !== null && !response.ok()) {
    return err(`${route} answered HTTP ${response.status()} — not proof material`);
  }
  await page.waitForSelector(options.readySelector);

  const stem = routeStem(route);
  const renderPath = join(options.outDir, `${stem}.png`);
  await page.screenshot({ path: renderPath, fullPage: options.fullPage });
  process.stdout.write(`${route} render=${renderPath}\n`);

  if (options.tabs > 0) {
    for (let press = 0; press < options.tabs; press += 1) {
      await page.keyboard.press('Tab');
    }
    const fact = await activeElementFact(page);
    const focusPath = join(options.outDir, `${stem}-after-${options.tabs}-tabs.png`);
    await page.screenshot({ path: focusPath, fullPage: false });
    process.stdout.write(
      `${route} after ${options.tabs} Tab(s) activeElement=${fact} render=${focusPath}\n`,
    );
  }
  return ok(undefined);
}

// Playwright cannot return Result; translate its failures to err() at this
// single boundary.
async function probeAll(options: ProbeOptions): Promise<Result<void, string>> {
  await mkdir(options.outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: options.viewport });
    for (const route of options.routes) {
      const probed = await probeRoute(page, route, options);
      if (isErr(probed)) {
        return probed;
      }
    }
    return ok(undefined);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    if (detail.includes('ERR_CONNECTION_REFUSED')) {
      return err(`nothing serving at ${options.origin}.\n${USAGE}`);
    }
    return err(detail);
  } finally {
    await browser.close();
  }
}

async function main(): Promise<Result<void, string>> {
  const options = parseArgs(process.argv.slice(2));
  if (isErr(options)) {
    return options;
  }
  return probeAll(options.value);
}

const outcome = await main();
if (isErr(outcome)) {
  process.stderr.write(`visual-probe: ${outcome.error}\n`);
  process.exitCode = 1;
}
