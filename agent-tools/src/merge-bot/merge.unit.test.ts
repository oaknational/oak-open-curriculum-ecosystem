import { describe, expect, it } from 'vitest';

import { readEnv } from './merge.js';

/**
 * Pure environment construction for the read-path gh executor — params in,
 * object out, no fakes. The env split is the F-156 cure: reads run on the
 * session's keyring (the only auth `gh agent-task` accepts), writes on the
 * minted token via fetch; these pins keep that split structural.
 */

describe('readEnv', () => {
  it('carries no token of any kind — a stale ambient token never reaches a read', () => {
    // The founding failure: the review-run probe inherited the minted
    // GH_TOKEN and `gh agent-task` refused the installation token. Reads
    // are keyring-deterministic — both token variables are stripped, never
    // passed through, never injected.
    const env = readEnv({
      PATH: '/usr/bin',
      GH_TOKEN: 'stale-app-token',
      GITHUB_TOKEN: 'ambient-actions-token',
    });

    expect(env.GH_TOKEN).toBeUndefined();
    expect(env.GITHUB_TOKEN).toBeUndefined();
    expect(env.PATH).toBe('/usr/bin');
  });

  it('pins the host and strips the enterprise-token fallbacks (security H1)', () => {
    // An ambient GH_HOST would steer gh's READS off github.com while the
    // merge PUT stays pinned to api.github.com by construction — the
    // reading and the act must run against the same host.
    const env = readEnv({
      GH_HOST: 'ghe.example.com',
      GH_ENTERPRISE_TOKEN: 'enterprise-secret',
      GITHUB_ENTERPRISE_TOKEN: 'legacy-secret',
    });

    expect(env.GH_HOST).toBe('github.com');
    expect(env.GH_ENTERPRISE_TOKEN).toBeUndefined();
    expect(env.GITHUB_ENTERPRISE_TOKEN).toBeUndefined();
  });
});
