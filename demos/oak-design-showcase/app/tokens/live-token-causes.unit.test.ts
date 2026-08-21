// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { observe } from './live-token-causes';

function appendStylesheetLink(): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/fake.css';
  document.body.append(link);
  return link;
}

const flushObservers = async (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

afterEach(() => {
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    link.remove();
  }
});

describe('observe: read causes report', () => {
  it('reports a pre-existing stylesheet load, and a load on a link appended later', async () => {
    const existing = appendStylesheetLink();
    let causes = 0;
    const stop = observe(document, () => {
      causes += 1;
    });
    existing.dispatchEvent(new Event('load'));
    expect(causes).toBeGreaterThan(0);
    const appended = appendStylesheetLink();
    await flushObservers();
    const beforeLoad = causes;
    appended.dispatchEvent(new Event('load'));
    expect(causes).toBeGreaterThan(beforeLoad);
    stop();
  });
});

describe('observe: teardown releases every listener', () => {
  it('releases a load listener that never fired — the leak shape `once` cannot clear', () => {
    // A listener on an already-loaded persistent sheet never fires, so
    // `once` never removes it; only the teardown can (round-5 finding:
    // each visit leaked one listener per layout sheet).
    const link = appendStylesheetLink();
    let causes = 0;
    const stop = observe(document, () => {
      causes += 1;
    });
    stop();
    link.dispatchEvent(new Event('load'));
    expect(causes).toBe(0);
  });

  it('releases the never-fired listener of a link that arrived mid-subscription', async () => {
    let causes = 0;
    const stop = observe(document, () => {
      causes += 1;
    });
    const link = appendStylesheetLink();
    await flushObservers();
    stop();
    const afterStop = causes;
    link.dispatchEvent(new Event('load'));
    expect(causes).toBe(afterStop);
  });

  it('registers nothing after teardown — a later link append and load report nothing', async () => {
    let causes = 0;
    const stop = observe(document, () => {
      causes += 1;
    });
    stop();
    const link = appendStylesheetLink();
    await flushObservers();
    link.dispatchEvent(new Event('load'));
    expect(causes).toBe(0);
  });
});

describe('observe: subscriber independence', () => {
  it('two subscribers sharing one upstream callback tear down independently', () => {
    // Subscribers share the store's scheduler callback identity; the DOM
    // deduplicates identical registrations, so without a per-observe
    // wrapper one teardown would remove the registration every other
    // subscriber depends on (gateway finding, probed first-hand).
    const link = appendStylesheetLink();
    let causes = 0;
    const shared = (): void => {
      causes += 1;
    };
    const stopFirst = observe(document, shared);
    const stopSecond = observe(document, shared);
    stopFirst();
    const before = causes;
    link.dispatchEvent(new Event('load'));
    expect(causes).toBeGreaterThan(before);
    stopSecond();
  });
});
