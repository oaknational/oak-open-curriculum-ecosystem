import { describe, expect, it } from 'vitest';

import { getSpacingVar } from './spacing';

describe('getSpacingVar', () => {
  it('returns CSS variables for known tokens', () => {
    expect(getSpacingVar('stack')).toBe('var(--app-gap-stack)');
    expect(getSpacingVar('cluster')).toBe('var(--app-gap-cluster)');
    expect(getSpacingVar('section')).toBe('var(--app-gap-section)');
    expect(getSpacingVar('grid')).toBe('var(--app-gap-grid)');
    expect(getSpacingVar('inline-base')).toBe('var(--app-layout-inline-padding-base)');
    expect(getSpacingVar('inline-wide')).toBe('var(--app-layout-inline-padding-wide)');
  });

  it('throws when the token is unknown', () => {
    expect(() => getSpacingVar('unknown-token' as never)).toThrow(/Unknown spacing token/);
  });
});
