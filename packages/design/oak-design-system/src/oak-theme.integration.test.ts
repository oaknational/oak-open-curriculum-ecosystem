/**
 * The theme runtime's behaviour contract, proven on the SHIPPED FORM: each
 * test evaluates the emitted dist/oak-theme.js (integration class by
 * behaviour shape — the system under test runs inside the test process
 * against injected fakes, testing-strategy.md §Test Types), so the artefact
 * browsers actually load is what is proven, and no test touches a real
 * global (no-global-state-in-tests / ADR-078). The fakes model the
 * runtime's real collaborators: documentElement attributes, localStorage
 * (including the throwing private-mode shape), and matchMedia's
 * prefers-contrast query.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const runtimeSource = readFileSync(join(here, '..', 'dist', 'oak-theme.js'), 'utf8');

interface FakeWorld {
  window: {
    matchMedia?: (query: string) => FakeMediaQueryList;
    oakTheme?: {
      set(t: string): void;
      clear(): void;
      get(): string;
      choice(): string | null;
      themes: string[];
      motion: { set(m: string): void; get(): string; modes: string[] };
    };
  };
  attributes: Map<string, string>;
  fireContrastChange: () => void;
  /** Boot the runtime AGAIN over the same storage and document — the
   *  observation point for persistence claims: state a clear() removed
   *  must stay gone across a reload, not merely across the session. */
  reboot: () => FakeWorld['window'];
}

interface FakeMediaQueryList {
  matches: boolean;
  addEventListener: (type: string, listener: () => void) => void;
}

function createWorld(options?: {
  storedTheme?: string;
  storedMotion?: string;
  prefersMoreContrast?: boolean;
  storageThrows?: boolean;
  /** Write-only denial (quota-style): getItem works, setItem/removeItem
   *  throw — the shape that exposes a cleared choice resurrecting from a
   *  still-readable store. */
  storageWriteThrows?: boolean;
}): FakeWorld {
  const attributes = new Map<string, string>();
  // dataset mirrors the real DOMStringMap contract: property writes and
  // deletes are the same state as the data-* attributes, so the attributes
  // Map stays the single source of truth for every assertion.
  const datasetAttributeName = (property: string): string =>
    `data-${property.replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
  const documentFake = {
    documentElement: {
      setAttribute: (name: string, value: string) => {
        attributes.set(name, value);
      },
      removeAttribute: (name: string) => {
        attributes.delete(name);
      },
      dataset: new Proxy<Record<string, string | undefined>>(
        {},
        {
          get: (_target, property: string) => attributes.get(datasetAttributeName(property)),
          set: (_target, property: string, value: string) => {
            attributes.set(datasetAttributeName(property), String(value));
            return true;
          },
          deleteProperty: (_target, property: string) => {
            attributes.delete(datasetAttributeName(property));
            return true;
          },
        },
      ),
    },
  };
  const store = new Map<string, string>();
  if (options?.storedTheme !== undefined) {
    store.set('oak-theme', options.storedTheme);
  }
  if (options?.storedMotion !== undefined) {
    store.set('oak-motion', options.storedMotion);
  }
  const localStorageFake = {
    getItem: (key: string): string | null => {
      if (options?.storageThrows) {
        throw new Error('storage denied');
      }
      return store.get(key) ?? null;
    },
    setItem: (key: string, value: string): void => {
      if (options?.storageThrows || options?.storageWriteThrows) {
        throw new Error('storage denied');
      }
      store.set(key, value);
    },
    removeItem: (key: string): void => {
      if (options?.storageThrows || options?.storageWriteThrows) {
        throw new Error('storage denied');
      }
      store.delete(key);
    },
  };
  const contrastListeners: (() => void)[] = [];
  let prefersMore = options?.prefersMoreContrast ?? false;
  const matchMediaFake = (query: string): FakeMediaQueryList => ({
    get matches() {
      return query.includes('prefers-contrast') ? prefersMore : false;
    },
    addEventListener: (_type: string, listener: () => void) => {
      contrastListeners.push(listener);
    },
  });
  const windowFake: FakeWorld['window'] = { matchMedia: matchMediaFake };
  // The emitted file references window/document/localStorage/matchMedia as
  // bare identifiers; scoping them as parameters is the injection seam.
  const run = new Function('window', 'document', 'localStorage', 'matchMedia', runtimeSource);
  run(windowFake, documentFake, localStorageFake, matchMediaFake);
  return {
    window: windowFake,
    attributes,
    fireContrastChange: () => {
      prefersMore = !prefersMore;
      for (const listener of contrastListeners) {
        listener();
      }
    },
    reboot: () => {
      const secondWindow: FakeWorld['window'] = { matchMedia: matchMediaFake };
      run(secondWindow, documentFake, localStorageFake, matchMediaFake);
      return secondWindow;
    },
  };
}

describe('oakTheme choice() — the explicit-choice accessor', () => {
  it('reports null with no stored or session choice, while get() collapses to the kit-base default', () => {
    // No choice = no data-theme attribute — the identity's own default
    // governs the page (DDR-003 amendment 2026-08-11). get() cannot see a
    // brand's polarity lever, so its collapse names the kit-base default.
    const world = createWorld();
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.window.oakTheme?.get()).toBe('light');
  });

  it('reports null under the automatic contrast route while get() reports high-contrast', () => {
    const world = createWorld({ prefersMoreContrast: true });
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.window.oakTheme?.get()).toBe('high-contrast');
    expect(world.attributes.get('data-theme')).toBe('high-contrast');
  });

  it('reports a persisted choice on load', () => {
    const world = createWorld({ storedTheme: 'dark' });
    expect(world.window.oakTheme?.choice()).toBe('dark');
  });

  it('reports a session choice made through set(), including when persistence throws', () => {
    const world = createWorld({ storageThrows: true });
    world.window.oakTheme?.set('colour-safe');
    expect(world.window.oakTheme?.choice()).toBe('colour-safe');
    expect(world.attributes.get('data-theme')).toBe('colour-safe');
  });

  it('treats a stored value outside the theme list as no choice', () => {
    const world = createWorld({ storedTheme: 'sepia' });
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.attributes.has('data-theme')).toBe(false);
  });
});

describe('oakTheme clear() — the return to the identity default', () => {
  it('clears a session choice, and a reboot over the same storage does not resurrect it', () => {
    const world = createWorld();
    world.window.oakTheme?.set('dark');
    world.window.oakTheme?.clear();
    expect(world.attributes.has('data-theme')).toBe(false);
    expect(world.window.oakTheme?.choice()).toBeNull();
    // The claim is about the STORED choice: only a second boot can prove
    // the persisted half is gone rather than merely shadowed in memory.
    const secondBoot = world.reboot();
    expect(secondBoot.oakTheme?.choice()).toBeNull();
    expect(world.attributes.has('data-theme')).toBe(false);
  });

  it('clears a persisted choice from an earlier visit', () => {
    const world = createWorld({ storedTheme: 'dark' });
    world.window.oakTheme?.clear();
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.attributes.has('data-theme')).toBe(false);
  });

  it('keeps the cleared state for the whole session when storage removal fails', () => {
    // Quota-style denial: the store stays READABLE while removal throws, so
    // a persisted choice survives on disk — the session must still treat
    // the clear as authoritative rather than resurrecting the stored value.
    const world = createWorld({ storedTheme: 'dark', storageWriteThrows: true });
    world.window.oakTheme?.clear();
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.window.oakTheme?.get()).toBe('light');
    expect(world.attributes.has('data-theme')).toBe(false);
  });

  it('follows a live OS contrast change after a clear whose removal failed', () => {
    // The access commitment survives the same denial: with the session
    // cleared, an OS prefers-contrast change must still auto-apply —
    // a readable-but-unremovable stored choice is not an explicit choice.
    const world = createWorld({ storedTheme: 'dark', storageWriteThrows: true });
    world.window.oakTheme?.clear();
    world.fireContrastChange();
    expect(world.attributes.get('data-theme')).toBe('high-contrast');
  });

  it('keeps the access commitment: clearing under an OS contrast request re-applies high-contrast', () => {
    const world = createWorld({ prefersMoreContrast: true });
    world.window.oakTheme?.set('dark');
    expect(world.attributes.get('data-theme')).toBe('dark');
    world.window.oakTheme?.clear();
    // DDR-003 amendment 2026-08-11: returning to the identity default must
    // not drop an OS-level request for more contrast.
    expect(world.attributes.get('data-theme')).toBe('high-contrast');
    expect(world.window.oakTheme?.choice()).toBeNull();
  });

  it('clears the in-memory choice even when storage denies the removal', () => {
    const world = createWorld({ storageThrows: true });
    world.window.oakTheme?.set('dark');
    world.window.oakTheme?.clear();
    expect(world.window.oakTheme?.choice()).toBeNull();
    expect(world.attributes.has('data-theme')).toBe(false);
  });
});

describe('oakTheme pre-paint application', () => {
  it('applies a persisted choice to data-theme on load', () => {
    const world = createWorld({ storedTheme: 'dark' });
    expect(world.attributes.get('data-theme')).toBe('dark');
  });

  it('applies no attribute with no choice and no contrast preference', () => {
    const world = createWorld();
    expect(world.attributes.has('data-theme')).toBe(false);
  });

  it('follows a live OS contrast change until an explicit choice exists', () => {
    const world = createWorld();
    world.fireContrastChange();
    expect(world.attributes.get('data-theme')).toBe('high-contrast');
    world.window.oakTheme?.set('light');
    world.fireContrastChange();
    expect(world.attributes.get('data-theme')).toBe('light');
  });

  it('ignores a set() outside the theme list entirely', () => {
    const world = createWorld();
    world.window.oakTheme?.set('not-a-theme');
    expect(world.attributes.has('data-theme')).toBe(false);
    expect(world.window.oakTheme?.choice()).toBeNull();
  });
});

describe('oakTheme motion axis — system is its own no-choice semantic', () => {
  it('exposes no choice accessor on motion and reports system by default', () => {
    const world = createWorld();
    expect(world.window.oakTheme?.motion.get()).toBe('system');
    expect('choice' in (world.window.oakTheme?.motion ?? {})).toBe(false);
    expect(world.attributes.has('data-motion')).toBe(false);
  });

  it('applies and reports an explicit motion mode, removing the attribute for system', () => {
    const world = createWorld();
    world.window.oakTheme?.motion.set('reduced');
    expect(world.attributes.get('data-motion')).toBe('reduced');
    world.window.oakTheme?.motion.set('system');
    expect(world.attributes.has('data-motion')).toBe(false);
  });

  it('restores a persisted motion mode on load and ignores unknown values', () => {
    const world = createWorld({ storedMotion: 'reduced' });
    expect(world.attributes.get('data-motion')).toBe('reduced');
    world.window.oakTheme?.motion.set('half-speed');
    expect(world.attributes.get('data-motion')).toBe('reduced');
  });
});
