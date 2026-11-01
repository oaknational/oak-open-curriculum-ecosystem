import { describe, expect, it } from 'vitest';

import { mcpjamChildEnv } from '../../src/mcp-conformance/mcpjam-spawn.js';

/**
 * The environment every mcpjam child is launched with.
 *
 * The vendor's SDK builds a live PostHog analytics client AT MODULE LOAD,
 * gated on `DO_NOT_TRACK` / `MCPJAM_TELEMETRY_DISABLED` and nothing else. A
 * CLI flag cannot reach that — by the time argv is parsed the client already
 * exists — so the environment is the only place the decision can be made.
 *
 * Today the SDK's single `capture()` call fires on its eval feature, which
 * this repo never invokes, so nothing of ours has been reported. That is a
 * fact about the vendor's current code, not a property we control: a future
 * version could capture from any path. These tests pin the setting so it
 * cannot be dropped in a refactor and leave the decision to the vendor.
 *
 * `parentEnv` is a parameter rather than a `process.env` read so the tests
 * inject it (no-global-state-in-tests).
 */
describe('mcpjamChildEnv — vendor telemetry is declined before the child starts', () => {
  it('sets both gates the vendor honours', () => {
    const env = mcpjamChildEnv({});

    expect(env.DO_NOT_TRACK).toBe('1');
    expect(env.MCPJAM_TELEMETRY_DISABLED).toBe('1');
  });

  it('overrides an inherited opt-IN rather than deferring to it', () => {
    // A developer or CI runner with DO_NOT_TRACK=0 in their environment must
    // not silently re-enable reporting from a credentialed run.
    const env = mcpjamChildEnv({ DO_NOT_TRACK: '0', MCPJAM_TELEMETRY_DISABLED: '0' });

    expect(env.DO_NOT_TRACK).toBe('1');
    expect(env.MCPJAM_TELEMETRY_DISABLED).toBe('1');
  });

  it('passes the rest of the environment through untouched', () => {
    // The child still needs its inherited environment to run at all.
    const env = mcpjamChildEnv({ PATH: '/usr/bin', SOME_INHERITED_VAR: 'kept' });

    expect(env.PATH).toBe('/usr/bin');
    expect(env.SOME_INHERITED_VAR).toBe('kept');
  });
});
