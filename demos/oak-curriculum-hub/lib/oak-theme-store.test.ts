/**
 * The store's snapshot contract: the theme snapshot is the CHOICE model —
 * a persisted or session choice, never the applied html attribute (the
 * runtime's automatic prefers-contrast path also writes the attribute, so
 * applied ≠ chosen exactly when "Page default" must render). Motion keeps
 * the applied model: the runtime's 'system' IS its no-choice semantic. All
 * collaborators are simple injected fakes (no-global-state-in-tests /
 * ADR-078): the fake runtime models the real one's contract, where set()
 * APPLIES the choice to the page; the stored-choice resolver models the
 * runtime's persistence.
 */
import { describe, expect, it, vi } from 'vitest';

import { createOakThemeStore, createStoredChoiceResolver } from './oak-theme-store';
import type { OakMotionMode, OakThemeName, OakThemeRuntime } from './oak-theme-store';

function fakeRuntimeWorld(): {
  runtime: OakThemeRuntime;
  appliedTheme: () => string | undefined;
  appliedMotion: () => string;
} {
  let applied: OakThemeName | undefined;
  let motion: OakMotionMode = 'system';
  const runtime: OakThemeRuntime = {
    get: () => applied ?? 'light',
    set: (t: OakThemeName) => {
      applied = t;
    },
    themes: ['light', 'dark', 'high-contrast'],
    motion: {
      get: () => motion,
      set: (m: OakMotionMode) => {
        motion = m;
      },
      modes: ['system', 'reduced', 'full'],
    },
  };
  return { runtime, appliedTheme: () => applied, appliedMotion: () => motion };
}

describe('createOakThemeStore snapshots and setters', () => {
  it('reports the no-choice state as the empty sentinel, never as light', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    expect(store.getTheme()).toBe('');
  });

  it('notifies subscribers, applies and reports the choice after a setter write', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    const listener = vi.fn();
    store.subscribe(listener);
    store.setTheme('dark');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getTheme()).toBe('dark');
    expect(world.appliedTheme()).toBe('dark');
  });

  it('ignores a value outside the runtime theme list without notifying', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    const listener = vi.fn();
    store.subscribe(listener);
    store.setTheme('not-a-theme');
    expect(listener).not.toHaveBeenCalled();
    expect(store.getTheme()).toBe('');
    expect(world.appliedTheme()).toBeUndefined();
  });

  it('reports undefined snapshots without a runtime (theme-neutral server state)', () => {
    const store = createOakThemeStore(
      () => undefined,
      () => undefined,
    );
    expect(store.getTheme()).toBeUndefined();
    expect(store.getMotion()).toBeUndefined();
  });
});

describe('createOakThemeStore subscription contract', () => {
  it('stops notifying a subscriber after it unsubscribes', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setTheme('dark');
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('createOakThemeStore choice model', () => {
  it('reports a persisted choice on a fresh store (reload shape)', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => 'dark',
    );
    expect(store.getTheme()).toBe('dark');
  });

  it('treats a stored value outside the runtime theme list as no choice', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => 'sepia',
    );
    expect(store.getTheme()).toBe('');
  });

  it('does not read the applied state as a choice — the OS contrast route stays Page default', () => {
    const world = fakeRuntimeWorld();
    // The runtime's automatic prefers-contrast path applies high-contrast
    // WITHOUT persisting a choice (oak-theme.js auto()); the snapshot must
    // stay '' so the control reads "Page default" and choosing
    // High contrast still fires a change event.
    world.runtime.set('high-contrast');
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    expect(store.getTheme()).toBe('');
  });

  it('keeps a session choice visible over a stale persisted choice when persistence failed', () => {
    const world = fakeRuntimeWorld();
    // A prior session persisted 'dark'; this session's choice failed to
    // persist — the session choice still wins, mirroring the runtime's own
    // current-beats-stored doctrine.
    const store = createOakThemeStore(
      () => world.runtime,
      () => 'dark',
    );
    store.setTheme('high-contrast');
    expect(store.getTheme()).toBe('high-contrast');
  });
});

describe('createOakThemeStore motion axis (applied model)', () => {
  it('reports the runtime-applied motion mode — system is the no-choice semantic', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    expect(store.getMotion()).toBe('system');
  });

  it('notifies subscribers and applies the mode after a motion write', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    const listener = vi.fn();
    store.subscribe(listener);
    store.setMotion('reduced');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getMotion()).toBe('reduced');
    expect(world.appliedMotion()).toBe('reduced');
  });

  it('ignores a value outside the runtime mode list without notifying', () => {
    const world = fakeRuntimeWorld();
    const store = createOakThemeStore(
      () => world.runtime,
      () => undefined,
    );
    const listener = vi.fn();
    store.subscribe(listener);
    store.setMotion('half-speed');
    expect(listener).not.toHaveBeenCalled();
    expect(store.getMotion()).toBe('system');
  });
});

describe('createStoredChoiceResolver', () => {
  it('passes a stored value through and reads null as no choice', () => {
    expect(createStoredChoiceResolver(() => 'dark')()).toBe('dark');
    expect(createStoredChoiceResolver(() => null)()).toBeUndefined();
  });

  it('reads a throwing reader as no choice (private mode, storage denied)', () => {
    // A REAL throwing read (invalid-URL construction throws TypeError),
    // standing in for the storage access a locked-down browser denies.
    expect(createStoredChoiceResolver(() => new URL('not a url').href)()).toBeUndefined();
  });
});
