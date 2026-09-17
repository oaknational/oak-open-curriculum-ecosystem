/**
 * The theme/motion controls contract (kit consuming-nextjs.md §4): with the
 * oak-theme runtime present the switcher offers Identity default (the
 * no-choice state, DDR-003 dated amendment 2026-08-11) plus every theme
 * the runtime exposes — the access themes are not optional extras —
 * through labelled selects that write through to the runtime; without a
 * runtime (the server snapshot) it renders nothing, keeping server HTML
 * theme-neutral.
 *
 * The runtime is a simple fake injected through the store factory
 * (no-global-state-in-tests / ADR-078) — nothing here touches `window`.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { createOakThemeStore, IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakMotionMode, OakThemeName, OakThemeRuntime } from '@oaknational/oak-design-react';

import ThemeSwitcher from './ThemeSwitcher';

expect.extend(toHaveNoViolations);

// colour-contrast needs a canvas happy-dom does not provide; the per-theme
// contrast surface is computed against the kit's contrast manifest instead
// (the PR3 token-level gate + the §7 audit-in-CI slice) — a documented scope
// bound, not a silent cap.
const axeOptions = { rules: { 'color-contrast': { enabled: false } } };

const THEMES: OakThemeName[] = ['system', 'light', 'dark', 'high-contrast', 'colour-safe'];
const MODES: OakMotionMode[] = ['system', 'reduced', 'full'];

function fakeRuntime(): {
  runtime: OakThemeRuntime;
  set: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  motionSet: ReturnType<typeof vi.fn>;
} {
  // Mirrors the real runtime's contract: set() records the in-memory
  // current choice, which choice() reports; clear() removes it (the
  // no-choice state the store names Identity default); with no choice
  // get() collapses to the kit-base default.
  let current: OakThemeName | null = null;
  let motion: OakMotionMode = 'system';
  const set = vi.fn((t: OakThemeName) => {
    current = t;
  });
  const clear = vi.fn(() => {
    current = null;
  });
  const motionSet = vi.fn((m: OakMotionMode) => {
    motion = m;
  });
  const runtime: OakThemeRuntime = {
    get: () => current ?? 'light',
    set,
    clear,
    choice: () => current,
    themes: [...THEMES],
    motion: { get: () => motion, set: motionSet, modes: [...MODES] },
  };
  return { runtime, set, clear, motionSet };
}

/** A store over the injected fake runtime — the ADR-078 seam. */
function storeWith(runtime: OakThemeRuntime | undefined) {
  return createOakThemeStore(() => runtime);
}

describe('ThemeSwitcher rendering contract', () => {
  it('offers Identity default first, then every runtime theme, and all three motion modes', async () => {
    const { runtime } = fakeRuntime();
    const store = storeWith(runtime);
    const { container } = render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText('Theme');
    const motionSelect = screen.getByLabelText('Motion');
    const themeValues = Array.from(themeSelect.querySelectorAll('option')).map((o) => o.value);
    const motionValues = Array.from(motionSelect.querySelectorAll('option')).map((o) => o.value);
    // A relation, not a count: the leading option is the no-choice default
    // (DDR-003 dated amendment 2026-08-11) and the tail IS the runtime's
    // own list. Motion needs no sentinel: 'system' is its no-choice
    // semantic.
    expect(themeValues).toEqual([IDENTITY_DEFAULT, ...runtime.themes]);
    expect(motionValues).toEqual(MODES);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('renders nothing when the oak-theme runtime is absent (theme-neutral HTML)', () => {
    const store = storeWith(undefined);
    const { container } = render(<ThemeSwitcher store={store} />);
    expect(container.innerHTML).toBe('');
  });

  it('names the no-choice state Identity default, and a choice arc moves off and back to it', () => {
    // DDR-003 dated amendment 2026-08-11: the identity's own default is
    // the honest name of no-choice — a real selected option, never a
    // blank control (a controlled select with no matching option). The
    // arc proves the value tracks state rather than a hard-coded default.
    const { runtime } = fakeRuntime();
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText<HTMLSelectElement>('Theme');
    expect(themeSelect.value).toBe(IDENTITY_DEFAULT);
    expect(Array.from(themeSelect.querySelectorAll('option')).every((o) => o.value !== '')).toBe(
      true,
    );
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    expect(themeSelect.value).toBe('dark');
    fireEvent.change(themeSelect, { target: { value: IDENTITY_DEFAULT } });
    expect(themeSelect.value).toBe(IDENTITY_DEFAULT);
  });
});

describe('ThemeSwitcher write-through contract', () => {
  it('writes a theme choice through to the oak-theme runtime and reflects it', () => {
    const { runtime, set } = fakeRuntime();
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText<HTMLSelectElement>('Theme');
    fireEvent.change(themeSelect, { target: { value: 'high-contrast' } });
    expect(set).toHaveBeenCalledWith('high-contrast');
    expect(themeSelect.value).toBe('high-contrast');
  });

  it('routes an Identity default selection to the runtime clear, never to set', () => {
    const { runtime, set, clear } = fakeRuntime();
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText<HTMLSelectElement>('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    fireEvent.change(themeSelect, { target: { value: IDENTITY_DEFAULT } });
    expect(clear).toHaveBeenCalledTimes(1);
    expect(set).not.toHaveBeenCalledWith(IDENTITY_DEFAULT);
  });

  it('writes a motion choice through to the motion axis and reflects it', () => {
    const { runtime, motionSet } = fakeRuntime();
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const motionSelect = screen.getByLabelText<HTMLSelectElement>('Motion');
    fireEvent.change(motionSelect, { target: { value: 'reduced' } });
    expect(motionSet).toHaveBeenCalledWith('reduced');
    expect(motionSelect.value).toBe('reduced');
  });
});
