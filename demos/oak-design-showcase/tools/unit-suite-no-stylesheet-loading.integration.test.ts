import { afterEach, describe, expect, it } from 'vitest';

/**
 * The guard that bites: this suite must never load a stylesheet file.
 *
 * The package's vitest config disables happy-dom's stylesheet file loading
 * and handles a disabled load as success, because a `<link rel="stylesheet">`
 * with any href otherwise fires an unawaited fetch to the window's default
 * origin whose refusal lands as an unhandled error at random. That is a
 * configuration property, and a configuration property proves itself only
 * at its own boundary: this test appends an href-bearing link and asserts
 * the behaviour the settings guarantee — the link reports a synthetic load,
 * no error, and a NULL `sheet`. The null sheet is the self-contained signal:
 * only the disabled path dispatches `load` without parsing anything, while a
 * real fetch that succeeds populates `link.sheet` with a `CSSStyleSheet` and
 * a real fetch that fails dispatches `error`. So the guard cannot be satisfied
 * by a server that happens to answer on the default origin, nor by a refused
 * connection. With the settings gone, happy-dom's loader (which does not go
 * through the window's `fetch`, so a spy on it sees nothing) reaches for the
 * network and one of those two real outcomes fails this test deterministically
 * instead of the suite failing at random.
 *
 * It is an integration test by the estate's taxonomy: it awaits a runtime
 * timer and drives happy-dom's resource loader, so it names its environment
 * dependence in its filename. Probed both ways on 2026-09-08: under the
 * config, `load` with `sheet === null` inside the zero-delay flush; under a
 * control config without the settings and a local server answering with a
 * real stylesheet, the real load had not arrived by that flush (the guard
 * failed on `loaded`) and a longer wait showed `load` with a populated sheet
 * of one rule (the null-sheet assertion is the second, timing-independent
 * line); without the server, `error` on the refused connection.
 */

const flush = async (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

afterEach(() => {
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    link.remove();
  }
});

describe('suite environment: stylesheet links never load files', () => {
  it('an href-bearing stylesheet link reports a synthetic load, no error and no sheet', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/guard.css';
    let loaded = false;
    let errored = false;
    link.addEventListener('load', () => {
      loaded = true;
    });
    link.addEventListener('error', () => {
      errored = true;
    });
    document.head.append(link);
    await flush();
    expect(loaded).toBe(true);
    expect(errored).toBe(false);
    // A real fetch that succeeded would have parsed the file into a sheet.
    expect(link.sheet).toBeNull();
  });
});
