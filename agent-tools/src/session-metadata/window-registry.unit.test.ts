import { describe, expect, it } from 'vitest';

import { resolveWindowTokens } from './window-registry.js';

describe('resolveWindowTokens', () => {
  it('resolves the 1M variant from the full model id with the [1m] marker', () => {
    expect(resolveWindowTokens('claude-opus-4-8[1m]')).toBe(1_000_000);
  });

  it('resolves the 200k default for the bare model id', () => {
    expect(resolveWindowTokens('claude-opus-4-8')).toBe(200_000);
  });

  it('resolves the carried Opus 5 pair: the bare id to 200k and the [1m] marker to 1M', () => {
    expect(resolveWindowTokens('claude-opus-5')).toBe(200_000);
    expect(resolveWindowTokens('claude-opus-5[1m]')).toBe(1_000_000);
  });

  it('resolves the carried Opus 5.5 1M variant and leaves its unobserved bare id unresolved', () => {
    expect(resolveWindowTokens('claude-opus-5-5[1m]')).toBe(1_000_000);
    expect(resolveWindowTokens('claude-opus-5-5')).toBeUndefined();
  });

  it('returns undefined for an unknown model', () => {
    expect(resolveWindowTokens('some-future-model')).toBeUndefined();
  });
});
