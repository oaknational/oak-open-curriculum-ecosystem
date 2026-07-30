/**
 * The theme/motion controls contract (kit consuming-nextjs.md §4): with the
 * oak-theme runtime present the switcher offers every theme it exposes — all
 * five, because the access themes are not optional extras — through labelled
 * selects that write through to the runtime; without a runtime (the server
 * snapshot) it renders nothing, keeping server HTML theme-neutral.
 *
 * The theme select reads the CHOICE model: no explicit choice renders the
 * "Page default" placeholder (value ''), never the applied theme — so the
 * OS contrast route is not misreported as a choice, and the first real
 * choice always fires a change event. Motion keeps the applied model:
 * 'system' is its own no-choice semantic.
 *
 * The runtime is a simple fake injected through the store factory, with a
 * no-choice stored resolver as the second factory argument
 * (no-global-state-in-tests / ADR-078) — nothing here touches `window`.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { createOakThemeStore } from '@/lib/oak-theme-store';
import type { OakMotionMode, OakThemeName, OakThemeRuntime } from '@/lib/oak-theme-store';

import ThemeSwitcher from './ThemeSwitcher';

expect.extend(toHaveNoViolations);

// colour-contrast needs a canvas happy-dom does not provide; the per-theme
// contrast surface is computed against the kit's contrast manifest instead
// (the PR3 token-level gate + the §7 audit-in-CI slice) — a documented scope
// bound, not a silent cap.
const axeOptions = { rules: { 'color-contrast': { enabled: false } } };

const THEMES: OakThemeName[] = ['light', 'dark', 'system', 'high-contrast', 'colour-safe'];
const MODES: OakMotionMode[] = ['system', 'reduced', 'full'];

function fakeRuntime(): {
  runtime: OakThemeRuntime;
  set: ReturnType<typeof vi.fn>;
  motionSet: ReturnType<typeof vi.fn>;
} {
  let theme: OakThemeName = 'light';
  let motion: OakMotionMode = 'system';
  const set = vi.fn((t: OakThemeName) => {
    theme = t;
  });
  const motionSet = vi.fn((m: OakMotionMode) => {
    motion = m;
  });
  const runtime: OakThemeRuntime = {
    get: () => theme,
    set,
    themes: [...THEMES],
    motion: { get: () => motion, set: motionSet, modes: [...MODES] },
  };
  return { runtime, set, motionSet };
}

/** A store over the fake runtime with a no-choice stored resolver — the
 *  ADR-078 seam. */
function storeWith(runtime: OakThemeRuntime | undefined) {
  return createOakThemeStore(
    () => runtime,
    () => undefined,
  );
}

describe('ThemeSwitcher', () => {
  it('offers all five themes and all three motion modes through labelled selects', async () => {
    const { runtime } = fakeRuntime();
    const store = storeWith(runtime);
    const { container } = render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText('Theme');
    const motionSelect = screen.getByLabelText('Motion');
    const themeValues = Array.from(themeSelect.querySelectorAll('option')).map((o) => o.value);
    const motionValues = Array.from(motionSelect.querySelectorAll('option')).map((o) => o.value);
    expect(themeValues).toEqual(['', ...THEMES]);
    expect(motionValues).toEqual(MODES);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('renders nothing when the oak-theme runtime is absent (theme-neutral HTML)', () => {
    const store = storeWith(undefined);
    const { container } = render(<ThemeSwitcher store={store} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('ThemeSwitcher theme axis (choice model)', () => {
  it('renders the Page default placeholder when no explicit choice exists, not the applied theme', () => {
    const { runtime } = fakeRuntime();
    // The fake runtime's applied theme is 'light' throughout — the select
    // must NOT read it as a choice.
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText<HTMLSelectElement>('Theme');
    expect(themeSelect.value).toBe('');
    expect(screen.getByText('Page default')).toBeDefined();
  });

  it('writes the first theme choice through from the no-choice state and reflects it', () => {
    const { runtime, set } = fakeRuntime();
    const store = storeWith(runtime);
    render(<ThemeSwitcher store={store} />);
    const themeSelect = screen.getByLabelText<HTMLSelectElement>('Theme');
    fireEvent.change(themeSelect, { target: { value: 'high-contrast' } });
    expect(set).toHaveBeenCalledWith('high-contrast');
    expect(themeSelect.value).toBe('high-contrast');
  });
});

describe('ThemeSwitcher motion axis (applied model)', () => {
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
