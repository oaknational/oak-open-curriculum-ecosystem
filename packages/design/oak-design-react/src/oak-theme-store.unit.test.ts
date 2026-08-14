/**
 * The store's snapshot and notification contract. The theme snapshot is
 * the CHOICE model read through the runtime's choice() accessor, with the
 * no-choice state named IDENTITY_DEFAULT (DDR-003 dated amendment
 * 2026-08-11: the identity's own default is the honest name of no-choice,
 * selectable, and choosing it CLEARS the stored choice). undefined = no
 * runtime (the consumers' hydration gate) — a distinct state that must
 * never collapse into no-choice. The clearing semantics themselves
 * (persisted removal, the automatic contrast route surviving a clear) are
 * the KIT's behaviour, pinned by its own integration suite — re-asserting
 * them here through a fake runtime would test the fake. All collaborators
 * are simple injected fakes (no-global-state-in-tests / ADR-078).
 */
import { describe, expect, it, vi } from 'vitest';

import { createOakThemeStore, IDENTITY_DEFAULT } from './oak-theme-store';
import type { OakMotionMode, OakThemeName, OakThemeRuntime } from './oak-theme-store';

function fakeRuntimeWorld(seededChoice: OakThemeName | null = null): {
  runtime: OakThemeRuntime;
  appliedTheme: () => OakThemeName | undefined;
} {
  // Mirrors the real runtime's contract: set() APPLIES the choice to the
  // page and records it as the in-memory current choice, which choice()
  // reports ahead of any persisted (seeded) value; clear() removes both
  // halves and re-applies the automatic route (undefined here — the fake
  // models no OS contrast).
  let current: OakThemeName | null = null;
  // A persisted (seeded) choice is applied pre-paint by the real runtime,
  // so the fake boots with it applied too.
  let applied: OakThemeName | undefined = seededChoice ?? undefined;
  let seeded: OakThemeName | null = seededChoice;
  let motion: OakMotionMode = 'system';
  const runtime: OakThemeRuntime = {
    set: (t: OakThemeName) => {
      current = t;
      applied = t;
    },
    clear: () => {
      current = null;
      seeded = null;
      applied = undefined;
    },
    get: () => applied ?? 'light',
    choice: () => current ?? seeded,
    themes: ['system', 'light', 'dark', 'high-contrast'],
    motion: {
      get: () => motion,
      set: (m: OakMotionMode) => {
        motion = m;
      },
      modes: ['system', 'reduced', 'full'],
    },
  };
  return { runtime, appliedTheme: () => applied };
}

function storeOver(runtime: OakThemeRuntime | undefined) {
  return createOakThemeStore(() => runtime);
}

describe('createOakThemeStore snapshots', () => {
  it('reports undefined for theme, motion, and options when no runtime exists', () => {
    const store = storeOver(undefined);
    expect(store.getTheme()).toBeUndefined();
    expect(store.getMotion()).toBeUndefined();
    // The store fabricates no option values it cannot back (the recorded
    // options-fallbacks-to-undefined delta); consumers floor at their
    // hydration gate.
    expect(store.themeOptions()).toBeUndefined();
    expect(store.motionOptions()).toBeUndefined();
  });

  it('offers Identity default first, then exactly the runtime theme list', () => {
    const { runtime } = fakeRuntimeWorld();
    const store = storeOver(runtime);
    // A relation, not a literal count: the sentinel leads and the tail IS
    // the runtime's own list, whatever the kit ships.
    expect(store.themeOptions()).toEqual([IDENTITY_DEFAULT, ...runtime.themes]);
    expect(store.motionOptions()).toEqual(['system', 'reduced', 'full']);
  });

  it('names the no-choice state Identity default, and a choice arc moves off and back to it', () => {
    // Paired with the arc so a stub hard-coding the sentinel cannot pass:
    // no choice → the sentinel; an explicit choice → that choice; choosing
    // Identity default → the sentinel again (via the runtime's clear).
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    expect(store.getTheme()).toBe(IDENTITY_DEFAULT);
    store.setTheme('dark');
    expect(store.getTheme()).toBe('dark');
    store.setTheme(IDENTITY_DEFAULT);
    expect(store.getTheme()).toBe(IDENTITY_DEFAULT);
    expect(world.appliedTheme()).toBeUndefined();
  });

  it('reports a persisted choice from an earlier visit, and clearing it returns the sentinel', () => {
    const world = fakeRuntimeWorld('dark');
    const store = storeOver(world.runtime);
    expect(store.getTheme()).toBe('dark');
    store.setTheme(IDENTITY_DEFAULT);
    expect(store.getTheme()).toBe(IDENTITY_DEFAULT);
  });
});

describe('createOakThemeStore setters', () => {
  it('notifies subscribers, applies and reports the choice after a theme write', () => {
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    const listener = vi.fn();
    store.subscribe(listener);
    store.setTheme('dark');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getTheme()).toBe('dark');
    expect(world.appliedTheme()).toBe('dark');
  });

  it('writes a motion mode through the motion axis and reflects it', () => {
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    const listener = vi.fn();
    store.subscribe(listener);
    store.setMotion('reduced');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getMotion()).toBe('reduced');
  });

  it('notifies subscribers when Identity default is chosen (the clear is a state change)', () => {
    const world = fakeRuntimeWorld('dark');
    const store = storeOver(world.runtime);
    const listener = vi.fn();
    store.subscribe(listener);
    store.setTheme(IDENTITY_DEFAULT);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('stops notifying a listener after its unsubscribe cleanup runs', () => {
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    const removed = vi.fn();
    const retained = vi.fn();
    const unsubscribe = store.subscribe(removed);
    store.subscribe(retained);
    unsubscribe();
    store.setTheme('dark');
    // The retained listener proves the write notified — the removed
    // listener's silence is unsubscription, not a dead notifier.
    expect(removed).not.toHaveBeenCalled();
    expect(retained).toHaveBeenCalledTimes(1);
  });
});

describe('createOakThemeStore setter guards', () => {
  // The shared setter contract: a value outside the runtime's own list is a
  // no-op on BOTH axes — nothing written, nobody notified.
  it('ignores a value outside the runtime theme list without notifying', () => {
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    const listener = vi.fn();
    store.subscribe(listener);
    store.setTheme('not-a-theme');
    expect(listener).not.toHaveBeenCalled();
    expect(store.getTheme()).toBe(IDENTITY_DEFAULT);
  });

  it('ignores a value outside the runtime motion list without notifying', () => {
    const world = fakeRuntimeWorld();
    const store = storeOver(world.runtime);
    const listener = vi.fn();
    store.subscribe(listener);
    store.setMotion('not-a-mode');
    expect(listener).not.toHaveBeenCalled();
    expect(store.getMotion()).toBe('system');
  });
});
