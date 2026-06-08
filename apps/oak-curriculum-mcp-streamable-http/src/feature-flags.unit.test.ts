/**
 * Unit tests for the feature-flag resolution engine.
 *
 * These prove the engine's two postures resolve an optional env value to a
 * boolean correctly. They are deliberately flag-agnostic: which flag uses which
 * posture, and any flag's configured default, are configuration set at the call
 * site and are not re-tested here (testing-strategy: assert the mechanism, not
 * configuration collections).
 */

import { describe, expect, it } from 'vitest';

import { resolveOptInFlag, resolveKillSwitchFlag } from './feature-flags.js';

describe('resolveOptInFlag — default OFF', () => {
  it('is enabled only on an explicit "true"', () => {
    expect(resolveOptInFlag('true')).toBe(true);
  });

  it('is disabled when unset', () => {
    expect(resolveOptInFlag(undefined)).toBe(false);
  });

  it('is disabled on an explicit "false"', () => {
    expect(resolveOptInFlag('false')).toBe(false);
  });
});

describe('resolveKillSwitchFlag — default ON', () => {
  it('is enabled when unset (live by default)', () => {
    expect(resolveKillSwitchFlag(undefined)).toBe(true);
  });

  it('is enabled on an explicit "true"', () => {
    expect(resolveKillSwitchFlag('true')).toBe(true);
  });

  it('is disabled only on an explicit "false" (the kill-switch)', () => {
    expect(resolveKillSwitchFlag('false')).toBe(false);
  });
});
