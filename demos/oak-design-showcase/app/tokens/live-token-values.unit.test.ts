import { afterEach, describe, expect, it, vi } from 'vitest';

import { createLiveTokenValueStore, readTokenValues } from './live-token-values';

/**
 * The lesson these tests hold is the one that cost a debugging session: a
 * stylesheet's arrival in `<head>` is NOT the moment its rules reach the
 * cascade. Chromium sets `link.sheet` when the element is appended and fires
 * `load` more than a tenth of a second later, so a reader that stops at the
 * mutation prints the outgoing identity's values under the incoming
 * identity's swatches — correct pixels, stale numbers, and nothing obviously
 * broken to notice.
 *
 * They are wiring tests by design. Whether a colour resolves correctly is
 * the browser's job and is verified against a real one; what can be pinned
 * here is that every cause reaches the reader, which is the part that was
 * wrong.
 */

function rowFor(name: string): HTMLTableRowElement {
  const table = document.createElement('table');
  const body = document.createElement('tbody');
  const row = document.createElement('tr');
  row.dataset['token'] = name;
  body.append(row);
  table.append(body);
  document.body.append(table);
  return row;
}

afterEach(() => {
  document.body.replaceChildren();
  document.head.replaceChildren();
  delete document.documentElement.dataset['theme'];
});

describe('readTokenValues', () => {
  it('reports one entry per row, keyed by the token the row names', () => {
    rowFor('--text-primary');
    rowFor('--space-16');
    expect([...readTokenValues(document).keys()]).toEqual(['--text-primary', '--space-16']);
  });

  it('ignores an element carrying no token name rather than inventing a key', () => {
    const stray = document.createElement('div');
    stray.setAttribute('data-token', '');
    document.body.append(stray);
    rowFor('--space-16');
    expect([...readTokenValues(document).keys()]).toEqual(['--space-16']);
  });
});

describe('createLiveTokenValueStore', () => {
  it('reads once on subscribe, because the rows exist by then', () => {
    rowFor('--text-primary');
    const store = createLiveTokenValueStore(() => document);
    expect(store.getSnapshot().size).toBe(0);
    const unsubscribe = store.subscribe(() => undefined);
    expect(store.getSnapshot().has('--text-primary')).toBe(true);
    unsubscribe();
  });

  it('reports no values on the server, where there is no browser to ask', () => {
    expect(createLiveTokenValueStore(() => null).getServerSnapshot().size).toBe(0);
  });
});

describe('createLiveTokenValueStore watching', () => {
  it('re-reads when a stylesheet finishes loading, not merely when it is appended', async () => {
    // The regression this exists for: `load` is the event that says the
    // rules are in the cascade. Appending is only the request.
    rowFor('--text-primary');
    const store = createLiveTokenValueStore(() => document);
    const notified = vi.fn();
    const unsubscribe = store.subscribe(notified);
    notified.mockClear();

    // No href: the store keys off `rel`, and giving this one an address
    // would send the test environment out to fetch it.
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    document.head.append(link);
    await vi.waitFor(() => {
      expect(notified).toHaveBeenCalled();
    });

    notified.mockClear();
    link.dispatchEvent(new Event('load'));
    await vi.waitFor(() => {
      expect(notified).toHaveBeenCalled();
    });
    unsubscribe();
  });

  it('re-reads when the theme attribute changes on the root', async () => {
    rowFor('--text-primary');
    const store = createLiveTokenValueStore(() => document);
    const notified = vi.fn();
    const unsubscribe = store.subscribe(notified);
    notified.mockClear();

    document.documentElement.dataset['theme'] = 'dark';
    await vi.waitFor(() => {
      expect(notified).toHaveBeenCalled();
    });
    unsubscribe();
  });
});

describe('createLiveTokenValueStore teardown', () => {
  it('stops watching once its last subscriber has gone', async () => {
    rowFor('--text-primary');
    const store = createLiveTokenValueStore(() => document);
    const notified = vi.fn();
    store.subscribe(notified)();
    notified.mockClear();

    document.documentElement.dataset['theme'] = 'dark';
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(notified).not.toHaveBeenCalled();
  });
});
