import { describe, expect, it } from 'vitest';
import { createLightTheme } from '../themes/light';
import { resolveBreakpoint, type BreakpointName } from './breakpoints';

describe('resolveBreakpoint', () => {
  it('returns the breakpoint value from the semantic theme', () => {
    const theme = createLightTheme();
    const names: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    for (const name of names) {
      expect(resolveBreakpoint(theme, name)).toBe(theme.app.layout.breakpoints[name]);
    }
  });
});
