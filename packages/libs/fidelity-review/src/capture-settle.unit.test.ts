import { describe, expect, it } from 'vitest';

import {
  ANIMATION_KILL_CSS,
  captureElementShot,
  captureShot,
  createOriginGuard,
  FONTS_READY_BUDGET_MS,
  SETTLE_MS,
  settleForCapture,
  type RouteLike,
  type ShotPage,
} from './capture-settle';

/** A call-logging page fake: every leg records its call and argument so
 *  the ORDER of the settle sequence is the assertion, not just the
 *  presence of each call. */
function pageFake(): { page: ShotPage; log: string[] } {
  const log: string[] = [];
  const page: ShotPage = {
    evaluate: async (_fn, arg) => {
      log.push(`evaluate(budget=${arg})`);
      return undefined;
    },
    addStyleTag: async ({ content }) => {
      log.push(`style(${content === ANIMATION_KILL_CSS ? 'animation-kill' : 'OTHER'})`);
      return undefined;
    },
    waitForTimeout: async (ms) => {
      log.push(`wait(${ms})`);
    },
    screenshot: async ({ fullPage }) => {
      log.push(`shot(fullPage=${fullPage})`);
      return Buffer.from('png-bytes');
    },
  };
  return { page, log };
}

describe('settleForCapture', () => {
  it('runs the one settle recipe in order: bounded fonts wait, animation kill, settle delay', async () => {
    const { page, log } = pageFake();

    await settleForCapture(page);

    expect(log).toEqual([
      `evaluate(budget=${FONTS_READY_BUDGET_MS})`,
      'style(animation-kill)',
      `wait(${SETTLE_MS})`,
    ]);
  });
});

describe('captureShot', () => {
  it('settles BEFORE the shutter and returns the PNG bytes — never a path', async () => {
    const { page, log } = pageFake();

    const bytes = await captureShot(page, { fullPage: true });

    expect(log).toEqual([
      `evaluate(budget=${FONTS_READY_BUDGET_MS})`,
      'style(animation-kill)',
      `wait(${SETTLE_MS})`,
      'shot(fullPage=true)',
    ]);
    expect(bytes.toString()).toBe('png-bytes');
  });

  it('passes the above-fold shape through to the shutter', async () => {
    const { page, log } = pageFake();

    await captureShot(page, { fullPage: false });

    expect(log.at(-1)).toBe('shot(fullPage=false)');
  });
});

describe('captureElementShot', () => {
  it('settles the PAGE before shooting the element, under the identical recipe', async () => {
    const { page, log } = pageFake();
    const element = {
      screenshot: async () => {
        log.push('element-shot');
        return Buffer.from('element-png');
      },
    };

    const bytes = await captureElementShot(page, element);

    expect(log).toEqual([
      `evaluate(budget=${FONTS_READY_BUDGET_MS})`,
      'style(animation-kill)',
      `wait(${SETTLE_MS})`,
      'element-shot',
    ]);
    expect(bytes.toString()).toBe('element-png');
  });
});

function routeOf(url: string, log: string[]): RouteLike {
  return {
    request: () => ({ url: () => url }),
    continue: async () => {
      log.push(`continue(${url})`);
    },
    abort: async () => {
      log.push(`abort(${url})`);
    },
  };
}

describe('createOriginGuard', () => {
  const allowed = (url: string) => url.startsWith('http://localhost:3020');

  it('continues an allowed request and records nothing', async () => {
    const log: string[] = [];
    const guard = createOriginGuard(allowed);

    await guard.handleRoute(routeOf('http://localhost:3020/brands/oak/brand.css', log));

    expect(log).toEqual(['continue(http://localhost:3020/brands/oak/brand.css)']);
    expect(guard.violations()).toEqual([]);
  });

  it('aborts a disallowed request and records it — never a silent pixel change', async () => {
    const log: string[] = [];
    const guard = createOriginGuard(allowed);

    await guard.handleRoute(routeOf('http://169.254.169.254/latest/meta-data', log));

    expect(log).toEqual(['abort(http://169.254.169.254/latest/meta-data)']);
    expect(guard.violations()).toEqual(['http://169.254.169.254/latest/meta-data']);
  });

  it('records a response that LANDED outside the allowlist (the redirect re-check)', () => {
    const guard = createOriginGuard(allowed);

    guard.noteResponseUrl('http://localhost:3020/ok.css');
    guard.noteResponseUrl('https://evil.example/hop');

    expect(guard.violations()).toEqual(['https://evil.example/hop']);
  });

  it('deduplicates repeated violations', async () => {
    const log: string[] = [];
    const guard = createOriginGuard(allowed);

    await guard.handleRoute(routeOf('https://evil.example/x', log));
    await guard.handleRoute(routeOf('https://evil.example/x', log));

    expect(guard.violations()).toEqual(['https://evil.example/x']);
  });
});
